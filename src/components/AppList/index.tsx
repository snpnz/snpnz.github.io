import React, {HTMLAttributes} from 'react';
import {Alert, Box, List, ListItemButton, ListItemText, Typography, CircularProgress, ListItemAvatar, Avatar} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointsAction} from "../../store/main.slice";
import ListSubheader from '@mui/material/ListSubheader';
import { Link, useLocation } from 'react-router-dom';
import { getRemotePointsReportsForPoint } from '../../services/apiService';
import { IPointReportAll } from '../../types';
import { getHumanDate } from '../../helpers/dateHelper';
import {Popup} from "react-leaflet";

const AppList: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [id, setId] = React.useState<string | undefined>();
    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const location = useLocation();

    const { isOnline } = useAppSelector(s => s.main);
    const [reps, setReps] = React.useState<IPointReportAll[] | null>(null);
    const [err, setErr] = React.useState<string>('');

    const getData = async (id: string) => {
        try {
            const d = await getRemotePointsReportsForPoint(id);
            setReps(d);
        } catch (e) {
            setErr((e as unknown as Error).message);
        }
    }

    React.useEffect(() => {
        if (!isOnline || !id) {
            return;
        }
        setErr('');
        getData(id);

    }, [isOnline, id]);

    React.useEffect(() => {
        if (location.search) {
            const searchParams = new URLSearchParams(location.search.substr(1));

            if(searchParams.has("id")){
                setId(searchParams.get("id") || undefined);
            } else {
                setId(undefined);
                setReps(null);
            }
        } else {
            setId(undefined);
            setReps(null);
        }
    }, [location]);

    if (isPointsLoading) {
        return <Box sx={{ display: 'flex', mt: 3 }}>
            <CircularProgress />
        </Box>;
    }

    if (pointsLoadingError) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                Загрузить
            </Button>
        }>{pointsLoadingError}</Alert>
    }

    if (!points?.length) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                Загрузить
            </Button>
        }>Не загружены точки {pointsLoadingError}</Alert>
    }

    if (id) {
        if (!isOnline) {
            return <Alert severity="error" sx={{mt: 3}}>
                Просмор доступен только при наличии подключения к интеренету
            </Alert>;
        }

        const point = points?.find((p) => p.id === +id);
        if (!point) {
            return <Alert severity="error">No point {id}</Alert>
        }

        return <section><Box>
            <Typography variant="h6" component="h4" gutterBottom sx={{mt: 2}}>
                {point.name}
            </Typography>
            <Typography variant="subtitle1" component="h5" gutterBottom sx={{mb: 2}}>
                {point.description}
            </Typography>
            <Typography component="small" variant="body2" sx={{m: 0}}>
                Координыты точки: <a href={`geo:${point.point}`}>{point.point.join(', ')}</a>
            </Typography>
        </Box>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListSubheader>Отметки на точке</ListSubheader>
                {
                    (!!err || !reps) && <Alert severity="error">{err}</Alert>
                }
                {reps?.map(point => {
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
                                    <small>
                                        <em>{point?.comment}</em>
                                    </small>
                                </>}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </section>;
    }

    let lastGroup: React.ReactNode;
    return <section>
        <Typography variant="h6" component="h4" gutterBottom sx={{p: 1, mt: 2}}>
            Все точки
        </Typography>
        <Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {points.map(point => {
                    let sh = null;
                    if (lastGroup !== point?.group?.name) {
                        lastGroup = point?.group?.name
                        sh = <ListSubheader>{lastGroup}</ListSubheader>;
                    }

                    return (
                        <React.Fragment key={point.id}>
                            {sh}
                            <ListItemButton component={Link} to={`/list?id=${point.id}`}>
                                <ListItemText primary={point.name} secondary={point.description} />
                            </ListItemButton>
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    </section>
}

export default AppList;
