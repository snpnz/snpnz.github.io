import {get, post} from "../helpers/httpClient";
import {mapBackPointReportToFront, mapBackPointReportToFrontForAll, mapBackPointToFront, mapBackUserToFront} from "../mappers/apiMapper";
import {IAddPointReportRequest, IPoint, IPointReport, IPointReportAll, IUser} from "../types";
import {lsGet, lsRemove, lsSet} from "../helpers/localStorageHelper";
import {LsKey} from "../types/lsKeys.enum";

export const getRemotePoints = async (): Promise<IPoint[]> => {
    const { data } = await get('/api/points/');
    return data.map(mapBackPointToFront);
}

export const getRemotePointsReports = async (): Promise<IPointReport[]> => {
    const { data } = await get('/api/points_report/');
    return data.map(mapBackPointReportToFront);
}


export const getRemotePointsReportsForAll = async (): Promise<IPointReportAll[]> => {
    const { data } = await get('/api/points_report/?all=1');
    if (data && !data.length) {
        throw new Error('Список пуст');
    }
    return data.map(mapBackPointReportToFrontForAll);
}


export const addPointReport = async (request: IAddPointReportRequest): Promise<IPointReport[]> => {
    if (!navigator.onLine) {
        const already = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
        lsSet<IAddPointReportRequest[]>(LsKey.SaveReport, [...already, request]);
        return Promise.reject('Интернет недоступен');
    }
    const { data } = await post('/api/points_report/', request);
    return data.map(mapBackPointReportToFront);
}

export const addCachedPointReport = async (): Promise<IPointReport[]> => {
    const already = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
    if(!already?.length) {
        throw new Error('No cached IAddPointReportRequest');
    }
    const tasks = already.map(por => post('/api/points_report/', por));
    const res = await Promise.all(tasks);
    lsRemove(LsKey.SaveReport);
    return res;
}

export const updateUserData = async (): Promise<IUser> => {
    const { data } = await get('/api/user/');
    if (!data) {
        throw new Error('Пожалуйста авторизуйтесь');
    }
    return mapBackUserToFront(data);
}

