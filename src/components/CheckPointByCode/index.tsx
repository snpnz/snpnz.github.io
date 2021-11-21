import React from 'react';
import style from './style.module.css';
import {getDistanceBetweenPointsInMeters} from "../../helpers/distanceHelper";
import { formatDistance } from '../../helpers/formatHelper';
import {post} from "../../helpers/httpClient";
import {getSQLDate} from "../../helpers/dateHelper";
import {IPoint} from "../../types";
interface IQRScannerProps {
    code: string | null,
    points: IPoint[],
    onSave: () => void,
}

const CheckPointByCode: React.FC<IQRScannerProps> = ({ code, points, onSave }) => {
    const [lat, setLat] = React.useState<number | null>(null);
    const [lng, setLng] = React.useState<number | null>(null);
    const [status, setStatus] = React.useState<string | null>(null);
    const commentRef = React.useRef<HTMLTextAreaElement>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
        } else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
                commentRef.current!.focus();
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


    const point = points.find(point => point.code===code);
    if (!point) {
        return <div>
            <pre>
                Не удалось ничего найти для кода:
                {code}
            </pre>
        </div>
    }
    const dist = getDistanceBetweenPointsInMeters([point.point[0], point.point[1]], [lat, lng])
/*
* 				$id_point = $mysqli -> real_escape_string($params['id_point']);
				$coordinates = $mysqli -> real_escape_string($params['coordinates']);
				$comment = $mysqli -> real_escape_string($params['comment']);
				$created_at = $mysqli -> real_escape_string($params['created_at']);

* */

    const distPoints = points
        .map((x: IPoint) => ({...x, dist: getDistanceBetweenPointsInMeters([x.point[0], x.point[1]], [lat, lng])}))
        .sort(function(a,b) {
            return a.dist - b.dist;
        });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      post('/api/points_report/', {
          id_point: point.id.toString(),
          coordinates: [lat, lng].join(','),
          comment: commentRef.current!.value,
          created_at: getSQLDate(new Date())
      }).then(res => {
          console.log(res);
          onSave();
          window.navigator.vibrate(200);
      })
    }
    return <div className={style.qrScanner}>
        <p>{status}</p>
        <b>До точки: {formatDistance(dist)}</b>
        <h3><a href={`geo:${point.point.join(',')}`}>{point.name}</a></h3>
        <em>{point.description}</em>
        <p><small>Ближайшие: {
            distPoints.slice(0, 3).map((x, i, a) => {
                return <>
                <a href={`geo:${x.point.join(',')}`}>{x.name} - {formatDistance(x.dist)}</a>
                {i < a.length - 1 && ", "}
                </>
            })
        }</small></p>
        <hr />
        <form onSubmit={handleSubmit}>
            <textarea className={style.comment} rows={3} placeholder="Комментарий" ref={commentRef} />
            <button type="submit">Сохранить</button>
        </form>
    </div>
}

export default CheckPointByCode;