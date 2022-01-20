import { group } from "console";
import {IPoint, IPointReport, IUser} from "../types";

export const mapBackPointToFront = (backModel: {[key: string]: string}): IPoint => {
    return {
        code: backModel.code,
        description: backModel.description,
        id: +backModel.id,
        name: backModel.name,
        point: backModel.point.split(',').map(Number),
        group: !+backModel.id_point_group ? null : {
            id: +backModel.id_point_group,
            name: backModel.group_name,
            description: backModel.group_description
        }
    }
}
export const mapBackPointReportToFront = (backModel: {[key: string]: string}): IPointReport => {
    return {
        comment: backModel.comment,
        coordinates: backModel.coordinates.split(',').map(Number),
        created_at: new Date(Date.parse(backModel.created_at)).toLocaleString(),
        upload_at: new Date(Date.parse(backModel.upload_at)).toLocaleString(),
        id: +backModel.id,
        id_point: +backModel.id_point,
        id_user: +backModel.id_user,
        name: backModel.name,
    }
}

export const mapBackUserToFront = (backModel: {[key: string]: string}): IUser => {
    return {
        id: +backModel.id,
        login: backModel.login,
        name: backModel.name,
        surname: backModel.surname,
        photo: backModel.photo,
        stravaId: backModel.strava_id,
        registerDate: new Date(Date.parse(backModel.register_date)).toLocaleDateString()
    }
}
