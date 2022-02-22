export interface IRawUser {
    "id": string;
    "login": string;
    "name": string;
    "surname": string;
    "photo": string;
    "strava_id": string;
    "register_date": string;
}

export interface IPoint {
    id: number;
    name: string;
    point: number[];
    description: string;
    code: string;
    group?: {
        id: number;
        name: string;
        description?: string;
    } | null
}

export interface IPointReport {
    comment: string;
    coordinates: number[];
    created_at: Date;
    id: number;
    id_point: number;
    id_user: number;
    upload_at: Date;
    name: string;
    group?: {
        id: number;
        name: string;
        description?: string;
    } | null
}

export interface IPointReportAll extends IPointReport {
    user: {
        name: string;
        photo: string;
    }
}

export interface IAddPointReportRequest {
    id_point: string;
    coordinates: string;
    comment: string;
    created_at: string;
}

export interface IAddFriendPointReportRequest extends IAddPointReportRequest {
    invite: string;
    name: string;
    team?: string;
}

export interface IUser {
    id: number;
    login: string;
    name: string;
    surname: string;
    photo: string;
    stravaId: string;
    registerDate: string;
    isReferee: boolean;
}

export interface ILocalUpdatesHistory {
    points?: Date;
    pointsReports?: Date;
    user?: Date;
}

export type ThemeMode = 'light' | 'dark';

export interface IEvent {
    id: number;
    name: string;
    description: string;
    start: Date;
    finish: Date;
    createdAt: Date;
    author: {
        name: string,
        surname: string;
        photo: string;
    }
}

export interface IEventPointReferee {
    id: number;
    name: string,
    surname: string;
    photo: string;
}

export interface IEventPoint {
    id: number;
    pointId: number;
    name: string;
    coordinates: [number, number],
    idEventPointReferee: number | null,
    referee?: IEventPointReferee
}

export interface IEventWithPoints extends IEvent {
    points: IEventPoint[]
}

export interface IEventMember {
    id: number;
    eventId: number;
    name: string;
    surname: string;
    createdAt: Date;
    acceptedAt: Date;
    token: string;
    user?: IEventPointReferee;
    author?: IEventPointReferee;
}
