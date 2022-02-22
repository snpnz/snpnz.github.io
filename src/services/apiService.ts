import {del, get, post} from "../helpers/httpClient";
import {
    mapBackEventMemberToFront,
    mapBackEventsToFront,
    mapBackEventWithPointsToFront,
    mapBackPointReportToFront,
    mapBackPointReportToFrontForAll,
    mapBackPointToFront,
    mapBackUsersToFront,
    mapBackUserToFront
} from "../mappers/apiMapper";
import {
    IAddPointReportRequest,
    IEvent,
    IEventWithPoints,
    IPoint,
    IPointReport,
    IPointReportAll,
    IUser,
    IEventPointReferee,
    IEventMember, IAddFriendPointReportRequest
} from "../types";
import {lsGet, lsRemove, lsSet} from "../helpers/localStorageHelper";
import {LsKey} from "../types/lsKeys.enum";
import { notifyWithState } from "../helpers/notificationHelper";

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

export const getRemotePointsReportsForPoint = async (idPoint: string): Promise<IPointReportAll[]> => {
    const { data } = await get('/api/points_report/?all=1&id_point=' + idPoint);
    if (data && !data.length) {
        throw new Error('Список пуст');
    }
    return data.map(mapBackPointReportToFrontForAll);
}

export const addPointReport = async (request: IAddPointReportRequest): Promise<IPointReport[]> => {
    const cond = true; //!navigator.onLine;
    if (cond) {
        const already = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
        const a = [...already, request];
        lsSet<IAddPointReportRequest[]>(LsKey.SaveReport, a);
        return Promise.resolve([]);
        //return Promise.reject('Интернет недоступен');
    }
    const { data } = await post('/api/points_report/', request);
    return data.map(mapBackPointReportToFront);
}



export const addFriendPointReport = async (request: IAddFriendPointReportRequest): Promise<IAddFriendPointReportRequest[]> => {
    const already = lsGet<IAddFriendPointReportRequest[]>(LsKey.FriendReport) || [];
    const exist = already.find(p => p.invite === request.invite && p.id_point === request.id_point);
    if (exist) {
        throw new Error('Участник уже отмечен на точке');
    }

    const a = [...already, request];
    lsSet<IAddFriendPointReportRequest[]>(LsKey.FriendReport, a);
    notifyWithState('success', 'Сохранено (' + a.length + ')')
    return Promise.resolve(a);
}
export const addCachedPointReport = async (): Promise<IPointReport[]> => {
    const friendsReports = lsGet<IAddFriendPointReportRequest[]>(LsKey.FriendReport) || [];
    const userReports = lsGet<IAddPointReportRequest[]>(LsKey.SaveReport) || [];
    if(!friendsReports?.length && !userReports?.length) {
        throw new Error('No cached reports for save');
    }
    const tasks: Promise<any>[] = [];
    userReports.forEach(por => tasks.push(post('/api/points_report/', por)));
    friendsReports.forEach(por => tasks.push(post('/api/points_report/', por)));
    const res = await Promise.all(tasks);
    if (res.every((x) => x.success)) {
        lsRemove(LsKey.SaveReport);
        lsRemove(LsKey.FriendReport);
        notifyWithState('success', 'Данные сохранены на сервере');
    } else {
        throw new Error('Не удалось выгрузить данные. Авторизуйтесь');
    }

    return res;
}

export const updateUserData = async (): Promise<IUser> => {
    const { data } = await get('/api/user/');
    if (!data) {
        throw new Error('Пожалуйста авторизуйтесь');
    }
    return mapBackUserToFront(data);
}


export const getEvents = async (): Promise<IEvent[]> => {
    const { data } = await get('/api/events/');
    if (!data) {
        throw new Error('Пожалуйста авторизуйтесь');
    }
    return (data.map(mapBackEventsToFront));
}
export const getEvent = async (id: number): Promise<IEventWithPoints> => {
    const { data } = await get('/api/event/', { id: id.toString() });
    if (!data) {
        throw new Error('Пожалуйста авторизуйтесь');
    }
    return mapBackEventWithPointsToFront(data);
}

interface IAddEventPayload {
    name: string;
    description: string;
    start_at: string;
    finish_at: string;
}
export const addEvent = async (data: IAddEventPayload): Promise<{ id: number }> => {
    const { id, error } = await post('/api/events/', data);
    if (error) {
        throw new Error(error);
    }
    return { id: +id };
}

interface IAddEventPointPayload {
    id_event: number;
    id_point: number;
    sort_order: number;
}
export const addEventPoint = async (data: IAddEventPointPayload): Promise<{ id: number }> => {
    const { id, error } = await post('/api/event_points/', data);
    if (error) {
        throw new Error(error);
    }
    return { id: +id };
}

export const deleteEventPoint = async (id: number): Promise<{ success: any }> => {
    const { success, error } = await del('/api/event_points/', { id });
    if (error) {
        throw new Error(error);
    }
    return { success };
}


export const getUsers = async (): Promise<IEventPointReferee[]> => {
    const { data, error } = await get('/api/users/');
    if (error) {
        throw new Error(error);
    }
    return data.map(mapBackUsersToFront);
}

interface IAddEventPointRefereePayload{
    id_event_point: number;
    id_user: number;
}
export const addEventPointReferee = async (data: IAddEventPointRefereePayload): Promise<{ id: number }> => {
    const { id, error } = await post('/api/event_points_referees/', data);
    if (error) {
        throw new Error(error);
    }
    return { id: +id };
}

export const deleteEventPointReferee = async (id: number): Promise<{ success: any }> => {
    const { success, error } = await del('/api/event_points_referees/', { id });
    if (error) {
        throw new Error(error);
    }
    return { success };
}


export const getEventMembers = async (id_event: number): Promise<IEventMember[]> => {
    const { data, error } = await get('/api/event_members/', { id_event: id_event.toString() });
    if (error) {
        throw new Error(error);
    }

    if (!data) {
        throw new Error('Пожалуйста авторизуйтесь');
    }
    return data.map(mapBackEventMemberToFront);
}


interface IAddEventMemberPayload{
    id_event: number;
    id_user?: number;
    name: string;
    surname: string;
}
export const addEventMember = async (data: IAddEventMemberPayload): Promise<{ id: number }> => {
    const { id, error } = await post('/api/event_members/', data);
    if (error) {
        throw new Error(error);
    }
    return { id: +id };
}
