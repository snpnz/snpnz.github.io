import React from 'react';
import style from './style.module.css';
import { ReactComponent as Ic } from '../../icons/qr_code_scanner_black_24dp.svg'
import QRScanner from "../QRScanner";
import CheckPointByCode from "../CheckPointByCode";
import {get} from "../../helpers/httpClient";

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
const mapBackPointToFront = (backModel: {[key: string]: string}): IPoint => {
    return {
        code: backModel.code,
        description: backModel.description,
        id: +backModel.id,
        name: backModel.name,
        point: backModel.point.split(',').map(Number)
    }
}
const mapBackPointReportToFront = (backModel: {[key: string]: string}): IPointReport => {
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
const MainScreen: React.FC = () => {
    const [scan, setScan] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<string | null>(null);
    const [list, setList] = React.useState<IPointReport[] | null>(null);
    const [points, setPoints] = React.useState<IPoint[] | null>(null);
    const [actualKey, setActualKey] = React.useState<string>('');

    React.useEffect(() => {
        get(
            '/api/points/').then(data => {
            setPoints(data.data.map(mapBackPointToFront));
        });
    }, []);

    React.useEffect(() => {
        get(
            '/api/points_report/').then(data => {
            setList(data.data.map(mapBackPointReportToFront));
        });
    }, [actualKey]);

    const handleCode = (co: string | null) => {
        if (co && co.includes('?')){
            const search = co.split('?');
            const params = new URLSearchParams(search[1]);
            const token = params.get("code");
            setCode(token);
            window.navigator.vibrate(200);
            return;
        }
        setCode(co);
    }

    return <div className={style.qrScanner}>
        {!code && <div>
            {!scan && <button
                className={style.ololo}
                onClick={() => setScan(m => !m)}>
                Сканировать QR-код <Ic />
            </button>}
            {scan && <QRScanner onChange={handleCode} />}
            {list && <>{
                list.map((point) => {
                    return <div className={style.item} key={point.id}>
                        <a href={`geo:${point.coordinates.join(',')}`}>{point.name}</a>
                        <br />
                        <strong>{point.created_at.toLocaleString()}</strong> <em>{point.comment}</em>
                    </div>
                })
            }</>}
        </div>}
        {points && code && <CheckPointByCode code={code} points={points} onSave={() => {
            setCode(null);
            setScan(false);
            setActualKey(new Date().toLocaleString())
            window.navigator.vibrate(200);
        }} />}
    </div>
}

export default MainScreen;