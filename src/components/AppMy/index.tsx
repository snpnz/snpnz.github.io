import React, {HTMLAttributes} from 'react';
import {
    Alert,
    Box,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    CircularProgress,
    Avatar,
    ListItemAvatar,
    ListSubheader
} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointReportsAction} from "../../store/main.slice";
import {lsGet} from "../../helpers/localStorageHelper";
import {IAddFriendPointReportRequest, IAddPointReportRequest} from "../../types";
import {LsKey} from "../../types/lsKeys.enum";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getHumanDate } from '../../helpers/dateHelper';
import {notifyWithState} from "../../helpers/notificationHelper";

const copyToClipboard = (str: string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(str);
    return Promise.reject('The Clipboard API is not available.');
};


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

    const friendsRecords = lsGet<IAddFriendPointReportRequest[]>(LsKey.FriendReport) || [];

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
           Отметки на точках
        </Typography>

        {!!friendsRecords?.length && <Box>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Товарищеские ожидающие выгрузки
                        <button
                            onClick={() => {
                                copyToClipboard(JSON.stringify(friendsRecords))
                                    .then(() => notifyWithState('success', 'Copied!'))
                            }}>C</button>
                    </ListSubheader>
                }
            >
            {friendsRecords.map(point => {
                return (
                    <ListItemButton key={point.comment + point.created_at + point.id_point}>
                        <ListItemAvatar>
                            <Avatar>
                                <HourglassTopIcon color="warning" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={point.name + ' - ' + points.find(p=>+p.id === +point.id_point)!.name}
                            secondary={getHumanDate(new Date(point.created_at)) + ' (Ожидает выгрузки)' }
                        />
                    </ListItemButton>
                );
            })}
        </List></Box>}
        <Box>

            {
                !isUploadComplete && <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Мои ожидающие выгрузки
                        </ListSubheader>
                    }
                >
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
            {!pointReports?.length && pointReportsLoadingError ? <Alert severity="error" sx={{mt: 3}} action={
                <Button color="inherit" onClick={() => dispatch(getRemotePointReportsAction())} size="small">
                    Загрузить
                </Button>
            }>Не загружены точки {pointReportsLoadingError}</Alert> : <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Мои отметки из интернета
                    </ListSubheader>
                }
            >
                {pointReports.map(point => {
                    return (
                        <ListItemButton key={point.id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocationOnIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<>
                                {point.name}
                                <Typography variant="caption"  display="block" gutterBottom>
                                    {getHumanDate(point.created_at)}
                                </Typography>
                            </>} secondary={<>
                                                                <small>
                                    <em>{point?.comment}</em>
                                </small>
                            </>} />

                        </ListItemButton>
                    );
                })}
            </List>}
            {!pointReports.length && !pointReportsLoadingError && <Typography color="secondary" sx={{p:6, m:6, textAlign: 'center'}}>Здесь будут отображаться ваши отметки на точках</Typography>}
        </Box>
    </section>
}

export default AppMy;
