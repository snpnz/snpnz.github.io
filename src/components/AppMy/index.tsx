import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress, Avatar, ListItemAvatar} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointReportsAction} from "../../store/main.slice";
import {lsGet} from "../../helpers/localStorageHelper";
import {IAddPointReportRequest} from "../../types";
import {LsKey} from "../../types/lsKeys.enum";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getHumanDate } from '../../helpers/dateHelper';


const AppMy: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { pointReports, isPointReportsLoading, pointReportsLoadingError, isUploadComplete, points } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

    if (isPointReportsLoading) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (pointReportsLoadingError) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointReportsAction())} size="small">
                Загрузить
            </Button>
        }>{pointReportsLoadingError}</Alert>
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            Мои отметки на точках
        </Typography>
        <Box>
            {
                !isUploadComplete && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {lsGet<IAddPointReportRequest[]>(LsKey.SaveReport)?.map(point => {
                        return (
                            <ListItemButton key={point.comment + point.created_at + point.id_point}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <HourglassTopIcon color="error" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={points.find(p=>+p.id === +point.id_point)!.name}
                                    secondary={getHumanDate(new Date(point.created_at)) + ' (Ожидает выгрузки)' }
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            }
            {!pointReports?.length ? <Alert severity="error" sx={{mt: 3}} action={
                <Button color="inherit" onClick={() => dispatch(getRemotePointReportsAction())} size="small">
                    Загрузить
                </Button>
            }>Не загружены точки {pointReportsLoadingError}</Alert> : <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {pointReports.map(point => {
                    return (
                        <ListItemButton key={point.id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocationOnIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={point.name} secondary={getHumanDate(point.created_at)} />
                        </ListItemButton>
                    );
                })}
            </List>}
        </Box>
    </section>
}

export default AppMy;