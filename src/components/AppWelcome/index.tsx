import React, {HTMLAttributes} from 'react';
import {Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CachedIcon from '@mui/icons-material/Cached';
import CircularProgress from '@mui/material/CircularProgress';
import {useAppDispatch, useAppSelector} from "../../store";
import {lsGet} from "../../helpers/localStorageHelper";
import {ILocalUpdatesHistory} from "../../types";
import {LsKey} from "../../types/lsKeys.enum";
import {addCachedPointReportAction, getRemotePointReportsAction, getRemotePointsAction} from "../../store/main.slice";
import {Link} from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WidgetCurrent from "../WidgetCurrent";
import { getHumanDate } from '../../helpers/dateHelper';


const AppWelcome: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { isPointsLoading, isPointReportsLoading, user, isOnline, isUploadComplete, isUploadLoading } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const updatesDates = lsGet<ILocalUpdatesHistory>(LsKey.LocalUpdatesHistory) || {};

    return <Paper elevation={3} sx={{p: 4, m: 0}} >
            <Typography variant="subtitle2" component="h1">
                Привет
                <strong>{user?.name ? `,\u2008${user?.name}😉` : '!'}</strong>
            </Typography>
            <Typography variant="subtitle1" component="h1" gutterBottom>
                Состояние приложения
            </Typography>
            <List sx={{p:1}}>
                <ListItem>
                    <ListItemIcon>
                        {isOnline ? <CloudIcon color="success" /> : <CloudOffIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Доступ к интернету"
                        secondary={isOnline ? 'Есть' : 'Синхронизируем все при появлении'}
                    />
                </ListItem>
                <ListItem
                    secondaryAction={
                        !user && (
                            <Button component={Link} to={'/login'}>
                                Войти
                            </Button>
                        )
                    }
                >
                    <ListItemIcon>
                        {user ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Авторизация"
                        secondary={user ? user.name + ' ' + user.surname : 'Можно войти'}
                    />
                </ListItem>
                <ListItem
                    secondaryAction={
                        isPointsLoading
                            ? <CircularProgress />
                            : <IconButton edge="end" aria-label="delete" onClick={() => dispatch(getRemotePointsAction())}>
                            <CachedIcon />
                        </IconButton>
                    }
                >
                    <ListItemIcon>
                        {updatesDates?.points ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Список точек"
                        secondary={updatesDates?.points ? `Обновлен ${getHumanDate(new Date(updatesDates?.points))}` : 'Нет данных'}
                    />
                </ListItem>
                <ListItem
                    secondaryAction={
                        isPointReportsLoading
                            ? <CircularProgress />
                            : <IconButton edge="end" aria-label="delete" onClick={() => dispatch(getRemotePointReportsAction())}>
                                <CachedIcon />
                            </IconButton>
                    }
                >
                    <ListItemIcon>
                        {updatesDates?.pointsReports ? <CheckCircleIcon color="success" /> : <ErrorIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Список отметок"
                        secondary={updatesDates?.pointsReports ? getHumanDate(new Date(updatesDates?.pointsReports)) : 'Нет данных'}
                    />
                </ListItem>

                {!isUploadComplete && <ListItem
                    secondaryAction={
                        isUploadLoading
                            ? <CircularProgress />
                            : <IconButton edge="end" aria-label="delete" onClick={() => dispatch(addCachedPointReportAction())}>
                                <CloudUploadIcon/>
                            </IconButton>
                    }
                >
                    <ListItemIcon>
                        <ErrorIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Есть не загруженные данные"
                        secondary={'Не забудьте загрузить их при появлении доступа к интернету'}
                    />
                </ListItem>}
            </List>
            <WidgetCurrent />
        </Paper>
}

export default AppWelcome;
