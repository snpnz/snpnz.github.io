import React from 'react';
import ReactDOM from "react-dom";
import {Snackbar, Alert} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export const notify = (text: string, action?: React.ReactChildren | string) => {
    const container = document.createElement('aside');
    document.body.appendChild(container);

    const handleClose = () => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
    }

    ReactDOM.render(<Snackbar
        open={true}
    autoHideDuration={6000}
    onClose={handleClose}
    message={text}
    action={<>
        {action}
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    </>}
    />, container)

}

export const notifyWithState = (state: 'error' | 'warning' | 'success' | 'info', text: React.ReactNode, duration= 3000) => {
    const container = document.createElement('aside');
    document.body.appendChild(container);

    const handleClose = () => {
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
    }

    ReactDOM.render(<Snackbar open autoHideDuration={duration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={state} sx={{ width: '100%' }}>
            {text}
        </Alert>
    </Snackbar>, container)

}

export default notify;