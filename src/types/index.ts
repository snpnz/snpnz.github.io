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
    created_at: string;
    id: number;
    id_point: number;
    id_user: number;
    upload_at: string;
    name: string;
}

export interface IAddPointReportRequest {
    id_point: string;
    coordinates: string;
    comment: string;
    created_at: string;
}

export interface IUser {
    id: number;
    login: string;
    name: string;
    surname: string;
    photo: string;
    stravaId: string;
    registerDate: string;
}

export interface ILocalUpdatesHistory {
    points?: Date;
    pointsReports?: Date;
    user?: Date;
}

export type ThemeMode = 'light' | 'dark';