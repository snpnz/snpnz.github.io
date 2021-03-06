import React from 'react';
import {Alert, List, ListItemText, Modal, Button, Box, ListItemButton, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import {getRemotePointsAction} from '../../store/main.slice';
import {IPoint} from "../../types";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PointsModal: React.FC<{ open: boolean, onClose: (point?: IPoint) => void}> = ({ open, onClose }) => {

    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

return <Modal
        open={open}
        onClose={() => onClose()}
    >
        <Box sx={style}>
            <List>
                {points?.length ? points.map((option) => {
                    return <ListItemButton key={option.id} onClick={() => onClose(option)}>
                    <ListItemText
                        primary={<Typography color="primary">{option.name}</Typography>}
                        secondary={option?.group?.name || ''}
                    />
                </ListItemButton>
                }) : (
                    <Alert
                        severity="error"
                        sx={{mt: 3}}
                        action={
                            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                                Загрузить
                            </Button>
                        }>
                        Не загружены точки {isPointsLoading && "🛼"} {pointsLoadingError}
                    </Alert>
                )}
            </List>
        </Box>
    </Modal>;
}

export default PointsModal;