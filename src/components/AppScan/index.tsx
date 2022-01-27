import React, {HTMLAttributes} from 'react';
import { useNavigate } from "react-router-dom";
import {Box, Fab, Typography} from '@mui/material';
import QrReader from "react-qr-reader";
import CameraRearIcon from '@mui/icons-material/CameraRear';
import CameraFrontIcon from '@mui/icons-material/CameraFront';

const AppScan: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [mode, setMode] = React.useState<'user' | 'environment'>('environment');
    const [val, setVal] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const handleError = (err: Error) => {
        console.log(err)
    }


    const onChange = (data: string | null) => {
        data && window.navigator.vibrate(300);
        data && navigate('/add?code=' + data);
    }

    const handleScan = (data: string | null) => {
        if (data !== val) {

            if (data && /invite=/.test(data)) {
                navigate('/login?invite=' + data);
                return;
            }

            data && onChange(data.replace('https://sn58.tk/?code=',''));
            setVal(data);
        }
    }



    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}  onDoubleClick={() => onChange('CECUt8XuFLHqLDJt')}>
            Наведите камеру на QR-код
        </Typography>
        <Box><QrReader
            delay={600}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%' }}
            facingMode={mode}
        /></Box>
        <Fab aria-label="switch" onClick={() => setMode(m => mode === 'user' ? 'environment' : 'user')}  sx={{
            position: 'fixed',
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
        }}>
            {mode === 'user' ? <CameraFrontIcon /> : <CameraRearIcon />}
        </Fab>
    </section>
}

export default AppScan;