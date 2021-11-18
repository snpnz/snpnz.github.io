import React from 'react';
import QrReader from 'react-qr-reader';
import style from './style.module.css';
import { ReactComponent as Ic } from '../../icons/flip_camera_android_black_24dp.svg'
interface IQRScannerProps {
    onChange: (code: string | null) => void
}

const QRScanner: React.FC<IQRScannerProps> = ({ onChange }) => {
    const [mode, setMode] = React.useState<'user' | 'environment'>('environment');
    const [val, setVal] = React.useState<string | null>(null);
    const handleError = (err: Error) => {
        console.log(err)
    }

    const handleScan = (data: string | null) => {
        if (data !== val) {
            data && onChange(data);
            setVal(data);
        }
    }

    return <div className={style.qrScanner}>
        <button
            className={style.cameraSwitchBtn}
            onClick={() => setMode(m => mode === 'user' ? 'environment' : 'user')}>
            <Ic />
        </button>
        <h3 className={style.header} onDoubleClick={() => onChange('CECUt8XuFLHqLDJt')}>Наведите камеру на QR-код</h3>
        <QrReader
            delay={600}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%' }}
            facingMode={mode}
        />
    </div>
}

export default QRScanner;