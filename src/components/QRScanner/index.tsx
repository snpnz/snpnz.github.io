import React from 'react';
import QrReader from 'react-qr-reader';
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
            onChange(data);
            setVal(data);
        }
    }

    return <div>
        <button onClick={() => setMode(m => mode === 'user' ? 'environment' : 'user')}>Поменять камеру</button>
        <QrReader
            delay={600}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            facingMode={mode}
        />
    </div>
}

export default QRScanner;