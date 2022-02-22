import {
    IEvent,
    IEventMember,
    IEventPoint,
    IEventPointReferee,
    IEventWithPoints,
    IPoint,
    IPointReport,
    IPointReportAll,
    IUser
} from "../types";

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
        registerDate: new Date(Date.parse(backModel.register_date)).toLocaleDateString(),
        isReferee: backModel.is_referee === '1',
    }
}

export const mapBackEventsToFront = (backModel: {[key: string]: string}): IEvent => {
    return {
        id: +backModel.id,
        name: backModel.name,
        description: backModel.description,
        start: new Date(Date.parse(backModel.start_at)),
        finish: new Date(Date.parse(backModel.finish_at)),
        createdAt: new Date(Date.parse(backModel.created_at)),
        author: {
            name: backModel.author_name,
            surname: backModel.author_surname,
            photo: backModel.author_photo,
        }
    }
}

const mapBackEventPoint = (backModel: {[key: string]: string}): IEventPoint => {
   return {
       id: +backModel.id,
       pointId: +backModel.id_point,
       name: backModel.name,
       coordinates: backModel.coords.split(',').map(Number) as [number, number],
       idEventPointReferee: +backModel?.id_event_points_referee || null,
       referee: backModel?.referee_id ? {
            id: +backModel?.referee_id,
            name: backModel.referee_name,
            surname: backModel.referee_surname,
            photo: backModel.referee_photo,
        } : undefined
   }
}

export const mapBackEventWithPointsToFront = (backModel: {[key: string]: any}): IEventWithPoints => {
    return {
        id: +backModel.id,
        name: backModel.name,
        description: backModel.description,
        start: new Date(Date.parse(backModel.start_at)),
        finish: new Date(Date.parse(backModel.finish_at)),
        createdAt: new Date(Date.parse(backModel.created_at)),
        author: {
            name: backModel.author_name,
            surname: backModel.author_surname,
            photo: backModel.author_photo,
        },
        points: backModel?.points?.length ? backModel.points.map(mapBackEventPoint) : []
    }
}

export const mapBackUsersToFront = (backModel: {[key: string]: any}): IEventPointReferee => {
    return {
        id: +backModel.id,
        name: backModel.name,
        surname: backModel.surname,
        photo: backModel.photo,
    }
}


export const mapBackEventMemberToFront = (backModel: {[key: string]: any}): IEventMember => {
    return {
        id: +backModel.id,
        name: backModel.name,
        surname: backModel.surname,
        token: backModel.token,
        createdAt: new Date(Date.parse(backModel.created_at)),
        acceptedAt: new Date(Date.parse(backModel.accepted_at)),
        author: {
            id: +backModel.id_author,
            name: backModel.authorname,
            surname: backModel.authorsurname,
            photo: backModel.authorphoto,
        },
        user: {
            id: +backModel.id_user,
            name: backModel.username,
            surname: backModel.usersurname,
            photo: backModel.userphoto,
        },
        eventId: +backModel.id_event
    }
}