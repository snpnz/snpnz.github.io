import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAddPointReportRequest, ILocalUpdatesHistory, IPoint, IPointReport, IUser, ThemeMode} from "../types";
import {addPointReport, getRemotePoints, getRemotePointsReports, updateUserData, addCachedPointReport} from "../services/apiService";
import {lsGet, lsRemove, lsSet} from "../helpers/localStorageHelper";
import {LsKey} from "../types/lsKeys.enum";

interface IMainState {
    themeMode: ThemeMode;
    isOnline: boolean;
    isUploadComplete: boolean;
    isUploadLoading: boolean;
    uploadError: string;
    points: IPoint[];
    isPointsLoading: boolean;
    pointsLoadingError: string;

    pointReports: IPointReport[];
    isPointReportsLoading: boolean;
    pointReportsLoadingError: string;

    isPointReportSaving: boolean;
    pointReportError: string;

    isUserLoading: boolean;
    userError: string;
    user: IUser | null;
}

function getSystemTheme(): ThemeMode {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? "dark"
        :"light";
}

const  initialState: IMainState = {
    themeMode: lsGet<ThemeMode>(LsKey.Theme) || getSystemTheme(),
    isOnline: navigator.onLine,
    isUploadComplete: !lsGet<IAddPointReportRequest[]>(LsKey.SaveReport),
    isUploadLoading: false,
    uploadError: '',
    points: lsGet<IPoint[]>(LsKey.Points) || [],
    isPointsLoading: false,
    pointsLoadingError: '',
    pointReports: lsGet<IPointReport[]>(LsKey.PointReports) || [],
    isPointReportsLoading: false,
    pointReportsLoadingError: '',
    isPointReportSaving: false,
    pointReportError: '',
    isUserLoading: false,
    userError: '',
    user: lsGet<IUser>(LsKey.UserData) || null,
}

export const getRemotePointsAction = createAsyncThunk('sn58/getRemotePointsAction', getRemotePoints);
export const getRemotePointReportsAction = createAsyncThunk('sn58/getRemotePointReportsAction', getRemotePointsReports);
export const addPointReportAction = createAsyncThunk('sn58/addPointReportAction', addPointReport);
export const addCachedPointReportAction = createAsyncThunk('sn58/addCachedPointReportAction', addCachedPointReport);
export const updateUserDataAction = createAsyncThunk('sn58/updateUserDataAction', updateUserData);

const mainSlice = createSlice({
    name: "sn58",
    initialState: initialState,
    reducers: {
        toggleTheme: (state) => { // , action: PayloadAction<number>
            const val: ThemeMode = state.themeMode === 'light' ? 'dark' : 'light';
            state.themeMode = val;
            lsSet<ThemeMode>(LsKey.Theme, val);
        },
        setOnlineState: (state, action: PayloadAction<boolean>) => { //
            state.isOnline = action.payload;
        },
        setUser: (state, action: PayloadAction<IUser>) => { //
            state.user = action.payload;
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
            lsSet<IPoint[]>(LsKey.Points, action.payload);
            lsSet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory, {
                ...lsGet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory) || {},
                points: new Date()
            })
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
            lsSet<IPointReport[]>(LsKey.PointReports, action.payload);
            lsSet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory, {
                ...lsGet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory) || {},
                pointsReports: new Date()
            })
            state.isPointReportsLoading = false;
        })

        builder.addCase(addPointReportAction.pending, (state, action) => {
            state.isPointReportSaving = true;
            if (!state.isOnline) {
                const already = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
                lsSet<IAddPointReportRequest[]>(LsKey.SaveReport, [...already, action.payload!]);
                state.pointReportError = 'Нет доступа к интернету';
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

        builder.addCase(addCachedPointReportAction.pending, (state, action) => {
            state.isUploadLoading = true;
        })
        builder.addCase(addCachedPointReportAction.rejected, (state, action) => {
            state.uploadError = (action?.payload as Error).message;
            state.isUploadLoading = false;
            state.isUploadComplete = false;
        })
        builder.addCase(addCachedPointReportAction.fulfilled, (state, action) => {
            lsRemove(LsKey.SaveReport);
            state.isUploadLoading = false;
            state.uploadError = '';
            state.isUploadComplete = true;
        })

        builder.addCase(updateUserDataAction.pending, (state, action) => {
            state.isUserLoading = true;
        })
        builder.addCase(updateUserDataAction.rejected, (state, action) => {
            state.userError = 'Ошибка загрузки информации о пользователе';
            state.isUserLoading = false;
            lsRemove(LsKey.UserData);
        })
        builder.addCase(updateUserDataAction.fulfilled, (state, action) => {
            lsSet<IUser>(LsKey.UserData, action.payload);
            lsSet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory, {
                ...lsGet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory) || {},
                user: new Date()
            })
            state.user = action.payload;
            state.isUserLoading = false;
        })
    },
});

export default mainSlice.reducer;

export const { toggleTheme, setOnlineState } = mainSlice.actions;