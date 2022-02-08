import React from 'react';
import {Alert, List, ListItemText, Modal, Button, Box, ListItemButton, Typography, SxProps, Theme} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import {getRemotePointsAction} from '../../store/main.slice';
import {IPoint} from "../../types";
import {modalStyles} from "../../commonStyles/modalStyles";

const PointsModal: React.FC<{ open: boolean, onClose: (point?: IPoint) => void}> = ({ open, onClose }) => {

    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

return <Modal
        open={open}
        onClose={() => onClose()}
    >
        <Box sx={modalStyles as unknown as SxProps<Theme> }>
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