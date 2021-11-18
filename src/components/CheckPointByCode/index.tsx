import React from 'react';
import style from './style.module.css';
import {IPoint} from "../MainScreen";
import {getDistanceBetweenPointsInMeters} from "../../helpers/distanceHelper";
import { formatDistance } from '../../helpers/formatHelper';
interface IQRScannerProps {
    code: string | null,
    points: IPoint[],
}

const CheckPointByCode: React.FC<IQRScannerProps> = ({ code, points }) => {
    const [lat, setLat] = React.useState<number | null>(null);
    const [lng, setLng] = React.useState<number | null>(null);
    const [status, setStatus] = React.useState<string | null>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
        } else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }, () => {
                setStatus('Unable to retrieve your location');
            });
        }
    }

    React.useEffect(() => {
        getLocation();
    }, []);

    if (!lat || !lng) {
        return <>
            <button onClick={getLocation}>Get Location</button>
        </>
    }


    const point = points.find(point => point.code===code)!;
    const dist = getDistanceBetweenPointsInMeters([point.point[0], point.point[1]], [lat, lng])

    return <div className={style.qrScanner}>
        <p>{status}</p>
        <b>До точки: {formatDistance(dist)}</b>
        <h3><a href={`geo:${lat},${lng}`}>{point.name}</a></h3>
        <em>{point.description}</em>
    </div>
}

export default CheckPointByCode;