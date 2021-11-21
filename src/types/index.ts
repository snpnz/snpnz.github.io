export interface IUser {
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
}

export interface IAddPointReportRequest {
    id_point: string;
    coordinates: string;
    comment: string;
    created_at: string;
}