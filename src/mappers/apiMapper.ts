import {IPoint, IPointReport, IPointReportAll, IUser} from "../types";

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
        created_at: new Date(backModel.created_at),
        upload_at: new Date(backModel.upload_at),
        id: +backModel.id,
        id_point: +backModel.id_point,
        id_user: +backModel.id_user,
        name: backModel.name,
    }
}

export const mapBackPointReportToFrontForAll = (backModel: {[key: string]: string}): IPointReportAll => {
    return {
        ...mapBackPointReportToFront(backModel),
        user: {
            name: backModel.username,
            photo: backModel.userphoto
        }
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
