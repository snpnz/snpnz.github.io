import React, {HTMLAttributes} from 'react';
import {Box, TextField, Typography, Modal, Button} from '@mui/material';
import QrReader from "react-qr-reader";
import CameraRearIcon from '@mui/icons-material/CameraRear';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { lsGet, lsSet } from '../../helpers/localStorageHelper';
import { LsKey } from '../../types/lsKeys.enum';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: 'inherit',
    p: 4,
  };
  

const AppReferee: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [mode, setMode] = React.useState<'user' | 'environment'>(lsGet(LsKey.RefereeCamera) || 'environment');
    const [val, setVal] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [comment, setComment] = React.useState<string>('');
    const [fio, setFio] = React.useState<string>('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
 
    const handleError = (err: Error) => {
        console.log(err)
    }


    const onChange = (data: string | null) => {
        data && window.navigator.vibrate(300);
        // data && navigate('/add?code=' + data);
    }

    const handleScan = (data: string | null) => {
        if (data !== val) {
            data && onChange(data.replace('https://sn58.tk/?invite=',''));
            setVal(data);
            handleClose();
        }
    }

    const handleChangeMode = () => {
        setMode((m) => {
            const newMode = m === 'user' ? 'environment' : 'user';
            lsSet(LsKey.RefereeCamera, newMode as string);
            return newMode;
        });
    }

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }
    const onFioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFio(event.target.value);
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}  onDoubleClick={() => onChange('CECUt8XuFLHqLDJt')}>
            referee mode
        </Typography>
        <Button color="primary" size='large' onClick={handleOpen}>Сканировать <QrCodeScannerIcon /> </Button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" color="primary" gutterBottom component="h2" sx={{display:'flex', justifyContent:'space-between'}}>
          Наведите камеру на QR-код <Button onClick={handleChangeMode}>
            {mode === 'user' ? <CameraFrontIcon /> : <CameraRearIcon />}
            </Button>
          </Typography>
          <QrReader
            delay={600}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', height: '100%' }}
            facingMode={mode}
        />
        <Box sx={{mt:2}}>
        <TextField
                label="ФИО (обязательно)"
                value={fio}
                onChange={onFioChange}
                sx={{ mt: 2 }}
                fullWidth
                autoFocus
            />
                    <TextField
                label="Коммент (не обязательно)"
                multiline
                maxRows={4}
                value={comment}
                onChange={onCommentChange}
                sx={{ mt: 2 }}
                fullWidth
            />
        </Box>
        </Box>
      </Modal>
    </section>
}

export default AppReferee;