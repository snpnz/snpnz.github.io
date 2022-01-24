import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress, Avatar, ListItemAvatar} from '@mui/material';
import {useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {IPointReportAll} from "../../types";
import { getRemotePointsReportsForAll } from '../../services/apiService';
import { getHumanDate } from '../../helpers/dateHelper';

const AppAll: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { isOnline } = useAppSelector(s => s.main);
    const [reps, setReps] = React.useState<IPointReportAll[] | null>(null);
    const [err, setErr] = React.useState<string>('');

    const getData = async () => {
        try {
            const d = await getRemotePointsReportsForAll();
            setReps(d);
        } catch (e) {
            setErr((e as unknown as Error).message);
        }
    }

    React.useEffect(() => {
        if (!isOnline) {
            return;
        }
        getData();

    }, [isOnline]);

    if (!isOnline) {
        return <Alert severity="error" sx={{mt: 3}}>
            Просмор истории отметок других учасников на точках доступен только при наличии подключения к интеренету
        </Alert>;
    }

    if (reps == null && !err) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (err) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => getData()} size="small">
                Загрузить
            </Button>
        }>{err}</Alert>
    }

    if (!reps?.length) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => getData()} size="small">
                Загрузить
            </Button>
        }>Не загружены точки {err}</Alert>
    }

    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{py: 1, mt: 2}}>
            Отметки всех пользователей
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {reps.map(point => {
                    return (
                        <ListItemButton key={point.comment + point.created_at + point.id_point}>
                            <ListItemAvatar>
                                <Avatar alt={point.user.name} src={point.user.photo} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<>
                                {point.user.name}
                                <Typography variant="caption"  display="block" gutterBottom>
                                    {getHumanDate(point.created_at)}
                                </Typography>
                                </>}
                                secondary={<>
                                    <strong>{point.name}</strong>
                                    <br />
                                    <small>
                                        <em>{point?.comment}</em>
                                    </small>
                                </>}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    </section>
}

export default AppAll;