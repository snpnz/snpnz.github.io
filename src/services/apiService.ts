import {get, post} from "../helpers/httpClient";
import {mapBackPointReportToFront, mapBackPointToFront} from "../mappers/apiMapper";
import {IAddPointReportRequest, IPoint, IPointReport} from "../types";

export const getRemotePoints = async (): Promise<IPoint[]> => {
    const { data } = await get('/api/points/');
    return data.map(mapBackPointToFront);
}

export const getRemotePointsReports = async (): Promise<IPointReport[]> => {
    const { data } = await get('/api/points_report/');
    return data.map(mapBackPointReportToFront);
}

export const addPointReport = async (request: IAddPointReportRequest): Promise<IPointReport[]> => {
    const { data } = await post('/api/points_report/', request);
    return data.map(mapBackPointReportToFront);
}
