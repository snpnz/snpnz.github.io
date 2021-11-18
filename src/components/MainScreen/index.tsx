import React from 'react';
import style from './style.module.css';
import { ReactComponent as Ic } from '../../icons/qr_code_scanner_black_24dp.svg'
import QRScanner from "../QRScanner";
import CheckPointByCode from "../CheckPointByCode";

export interface IPoint {
    id: number;
    name: string;
    point: number[];
    description: string;
    code: string;
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

const MainScreen: React.FC = () => {
    const [scan, setScan] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<string | null>(null);
    const [points, setPoints] = React.useState<IPoint[] | null>(null);

    React.useEffect(() => {
        fetch(
            '/api/points/',
            { credentials: 'include'}).then(res => res.json()).then(data => {
            setPoints(data.data.map(mapBackPointToFront));
        });
    }, []);

    return <div className={style.qrScanner}>
        {!code && <div>
            {!scan && <button
                className={style.ololo}
                onClick={() => setScan(m => !m)}>
                Сканировать QR-код <Ic />
            </button>}
            {scan && <QRScanner onChange={e => {setCode(e);}} />}
        </div>}
        {points && code && <CheckPointByCode code={code} points={points} />}
    </div>
}

export default MainScreen;