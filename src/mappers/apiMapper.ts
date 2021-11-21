import {IPoint, IPointReport} from "../types";

export const mapBackPointToFront = (backModel: {[key: string]: string}): IPoint => {
    return {
        code: backModel.code,
        description: backModel.description,
        id: +backModel.id,
        name: backModel.name,
        point: backModel.point.split(',').map(Number)
    }
}
export const mapBackPointReportToFront = (backModel: {[key: string]: string}): IPointReport => {
    return {
        comment: backModel.comment,
        coordinates: backModel.coordinates.split(',').map(Number),
        created_at: new Date(Date.parse(backModel.created_at)),
        upload_at: new Date(Date.parse(backModel.upload_at)),
        id: +backModel.id,
        id_point: +backModel.id_point,
        id_user: +backModel.id_user,
        name: backModel.name,
    }
}