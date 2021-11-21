import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAddPointReportRequest, IPoint, IPointReport} from "../types";
import {addPointReport, getRemotePoints, getRemotePointsReports} from "../services/apiService";
import {lsGet, lsRemove, lsSet} from "../helpers/localStorageHelper";
import {LsKey} from "../types/lsKeys.enum";

interface IMainState {
    themeMode: 'light' | 'dark';
    isOnline: boolean;
    isUploadComplete: boolean;
    points: IPoint[];
    isPointsLoading: boolean;
    pointsLoadingError: string;

    pointReports: IPointReport[];
    isPointReportsLoading: boolean;
    pointReportsLoadingError: string;

    isPointReportSaving: boolean;
    pointReportError: string;
}
const  initialState: IMainState = {
    themeMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark":"light",
    isOnline: navigator.onLine,
    isUploadComplete: false,
    points: lsGet<IPoint[]>(LsKey.Points) || [],
    isPointsLoading: false,
    pointsLoadingError: '',
    pointReports: lsGet<IPointReport[]>(LsKey.PointReports) || [],
    isPointReportsLoading: false,
    pointReportsLoadingError: '',
    isPointReportSaving: false,
    pointReportError: '',
}

export const getRemotePointsAction = createAsyncThunk('sn58/getRemotePointsAction', getRemotePoints);
export const getRemotePointReportsAction = createAsyncThunk('sn58/getRemotePointReportsAction', getRemotePointsReports);
export const addPointReportAction = createAsyncThunk('sn58/addPointReportAction', addPointReport);

const mainSlice = createSlice({
    name: "sn58",
    initialState: initialState,
    reducers: {
        toggleTheme: (state) => { // , action: PayloadAction<number>
            state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
        },
        setOnlineState: (state, action: PayloadAction<boolean>) => { //
            state.isOnline = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRemotePointsAction.pending, (state, action) => {
            if (!state.isOnline) {
                state.pointsLoadingError = 'Нет доступа к интернету';
            } else {
                state.isPointsLoading = true;
            }
        })
        builder.addCase(getRemotePointsAction.rejected, (state, action) => {
            state.pointsLoadingError = 'Ошибка загрузки информации о точках';
            state.isPointsLoading = false;
        })
        builder.addCase(getRemotePointsAction.fulfilled, (state, action) => {
            state.points = action.payload;
            lsSet<IPoint[]>(LsKey.Points, action.payload)
            state.isPointsLoading = false;
        })

        builder.addCase(getRemotePointReportsAction.pending, (state, action) => {
            if (!state.isOnline) {
                state.pointReportsLoadingError = 'Нет доступа к интернету';
            } else {
                state.isPointReportsLoading = true;
            }
        })
        builder.addCase(getRemotePointReportsAction.rejected, (state, action) => {
            state.pointReportsLoadingError = 'Ошибка загрузки информации о точках';
            state.isPointReportsLoading = false;
        })
        builder.addCase(getRemotePointReportsAction.fulfilled, (state, action) => {
            state.pointReports = action.payload;
            lsSet<IPointReport[]>(LsKey.PointReports, action.payload)
            state.isPointReportsLoading = false;
        })

        builder.addCase(addPointReportAction.pending, (state, action) => {
            if (!state.isOnline) {
                const already = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
                lsSet<IAddPointReportRequest[]>(LsKey.SaveReport, [...already, action.payload!]);
                state.pointReportError = 'Нет доступа к интернету';
            } else {
                state.isPointReportSaving = true;
            }
        })
        builder.addCase(addPointReportAction.rejected, (state, action) => {
            state.pointsLoadingError = 'Ошибка загрузки информации о точках';
            state.isPointReportSaving = false;
        })
        builder.addCase(addPointReportAction.fulfilled, (state, action) => {
            lsRemove(LsKey.SaveReport);
            state.isPointReportSaving = false;
        })
    },
});

export default mainSlice.reducer;

export const { toggleTheme, setOnlineState } = mainSlice.actions;