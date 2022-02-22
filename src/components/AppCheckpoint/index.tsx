import React, {HTMLAttributes} from 'react';
import {Alert, Autocomplete, CardActions, Link, ListItem, ListItemText, TextField} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useLocation, useNavigate} from "react-router-dom";
import {getDistanceBetweenPointsInMeters} from "../../helpers/distanceHelper";
import {formatDistance} from "../../helpers/formatHelper";
import {useAppDispatch, useAppSelector} from "../../store";
import { getRemotePointsAction} from '../../store/main.slice';
import {IAddFriendPointReportRequest, IEventMember, IPoint} from "../../types";
import {getSQLDate} from "../../helpers/dateHelper";
import {getCurrentGeoLocationAsync} from "../../helpers/geoLocationHelper";
import RadarIcon from '@mui/icons-material/Radar';
import { notifyWithState } from '../../helpers/notificationHelper';
import {addFriendPointReport, addPointReport} from "../../services/apiService";
import {lsGet} from "../../helpers/localStorageHelper";
import {LsKey} from "../../types/lsKeys.enum";

const validation_distance = 500;

const AppCheckpoint: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [comment, setComment] = React.useState<string>('');
    const [fio, setFio] = React.useState<string>('');
    const [team, setTeam] = React.useState<string>('');
    const [code, setCode] = React.useState<string|null>(null);
    const [invite, setInvite] = React.useState<string|null>(null);
    const [lat, setLat] = React.useState<number | null>(null);
    const [lng, setLng] = React.useState<number | null>(null);
    const [gpsErr, setGpsErr] = React.useState<string | null>(null);
    const [point, setPoint] = React.useState<IPoint | null>(null);
    const [availablePoints, setAvailablePoints] = React.useState<(IPoint & { dist?: number })[]>([]);

    const { points, isPointsLoading, pointsLoadingError, isPointReportSaving, pointReportError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (location.search) {
            const searchParams = new URLSearchParams(location.search.substr(1));

            if(searchParams.has("code")){
                setCode(searchParams.get("code"));
            }

            if(searchParams.has("invite")){
                setInvite(searchParams.get("invite"));
            }
        }

    }, [location]);

    React.useEffect(() => {
        getLocation();
    }, []);

    React.useEffect(() => {
        if (!points?.length || !code?.length) {
            return;
        }

        const p = points.find(p => p.code===code);

        setPoint(p || null)

    }, [points, code]);

    React.useEffect(() => {
        let distPoints = points;
        if (lat && lng) {
            const distPoints = points
                .map((x: IPoint) => ({
                    ...x,
                    dist: getDistanceBetweenPointsInMeters([x.point[0], x.point[1]], [lat, lng])
                }))
                .sort(function(a,b) {
                    return a.dist - b.dist;
                });

            if ((distPoints[0]?.dist || 10000) < validation_distance) {
                setCode(distPoints[0]?.code);
            }
        }

        setAvailablePoints(distPoints);
    }, [points, lat, lng])

    React.useEffect(() => {
        if (!invite) {
            return;
        }
        const friendsRecords = lsGet<IAddFriendPointReportRequest[]>(LsKey.FriendReport) || [];

        let fio = friendsRecords.find(f => f.invite === invite && /[А-Я][А-я-]+\s[А-Я][А-я-]+/.test(f.name))?.name;
        if (!fio?.length) {
            const ff = lsGet<IEventMember[]>(LsKey.LastEventMembers)
                ?.find(f => f.token === invite);
            if (ff && (ff.surname || ff.name)) {
                fio = [ff.surname, ff.name].join(' ');
            }
        }
        fio?.length && setFio(fio);
        let team = friendsRecords.find(f => f.invite === invite && f.team?.length)?.team;
        if (!team?.length) {
            const ff = lsGet<IEventMember[]>(LsKey.LastEventMembers)
                ?.find(f => f.token === invite);
            if (ff) {
                team = ff.team;
            }
        }
        team?.length && setTeam(team);


    }, [invite]);



    const getLocation = async () => {
        try {
            const [lt, ln] = await getCurrentGeoLocationAsync();
            setGpsErr(null);
            setLat(lt);
            setLng(ln);
        } catch (e) {
            setGpsErr((e as Error).message);
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const onFioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFio(event.target.value);
    }
    const onTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeam(event.target.value);
    }
    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
        try {
            if (invite) {
                await addFriendPointReport({
                    id_point: point!.id.toString(),
                    coordinates: [lat, lng].join(','),
                    comment,
                    created_at: getSQLDate(new Date()),
                    invite: invite,
                    name: fio,
                    team: team
                })
            } else {
                await  addPointReport({
                    id_point: point!.id.toString(),
                    coordinates: [lat, lng].join(','),
                    comment,
                    created_at: getSQLDate(new Date())
                })
            }
            notifyWithState('success', 'Готово!');
            window.navigator.vibrate(300);
            setTimeout(() => navigate('/my'), 100);
        } catch (e) {
            notifyWithState('error', (e as Error)?.message);
        }
        
    }

    if (!points?.length) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => dispatch(getRemotePointsAction())} size="small">
                Загрузить
            </Button>
        }>Не загружены точки {isPointsLoading && "🛼"} {pointsLoadingError}</Alert>
    }
    if (gpsErr || !lat || !lng) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => getLocation()} size="small">
                Обновить геопозицию
            </Button>
        }>Ошибка получения геопозиции. {gpsErr}</Alert>
    }





    if (!code || !point) {
        return <Autocomplete
            sx={{ mt: 4 }}
            fullWidth
            options={availablePoints}
            onChange={(e, v) => {
                setCode(v?.code || '');
            }}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
                return (<ListItem {...props}>
                    <ListItemText
                        primary={option.name + ` (${option.dist ? formatDistance(option.dist) : '-'})`}
                        secondary={option?.group?.name || ''}
                    />
                </ListItem>);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Выбрать точку"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'lolo', // disable autocomplete and autofill
                    }}
                />
            )}
        />
    }

    const dist = getDistanceBetweenPointsInMeters([point.point[0], point.point[1]], [lat, lng]);

    const isValid = dist < validation_distance || window.location.hash === '#noverify';  

    return <section>
        <Box sx={{ minWidth: 275, mt:2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Целевая точка
                    </Typography>
                    <Typography variant="h5" component="span">
                        {point.name}
                    </Typography>
                    {point?.group?.name && <Typography color="text.secondary">
                            {point?.group?.name}
                        </Typography>}
                    <Typography variant="body2">
                        {point.description}
                    </Typography>
                    {point.group?.name && <Typography variant="body2">
                        {point.group?.name}
                    </Typography>}
                </CardContent>
            </Card>
        </Box>
        <Box sx={{ minWidth: 275, mt:2, mb: 2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14, display:'flex', alignItems:'center' }} color="text.secondary" gutterBottom>
                     <RadarIcon color={isValid ? 'success' : 'error'} /> &nbsp; Текущая точка
                    </Typography>
                    <Typography variant="body2">
                        <Link href={`geo:${lat},${lng}`}>{lat},{lng}</Link>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        До целевой точки: {formatDistance(dist)}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Обновить мою позицию</Button>
                </CardActions>
            </Card>
        </Box>
        <form onSubmit={handleSubmit}>
            {invite && <>
            <TextField
                label="Фамилия и Имя (обязательно)"
                value={fio}
                onChange={onFioChange}
                sx={{ mt: 2 }}
                fullWidth
                required
            />
            <TextField
                label="Команда"
                value={team}
                onChange={onTeamChange}
                sx={{ mt: 2 }}
                fullWidth
            />
            </>}
            <TextField
                label="Комментарий (не обязательно)"
                multiline
                maxRows={4}
                value={comment}
                onChange={onChange}
                sx={{ mt: 2 }}
                fullWidth
                autoFocus
                disabled={!isValid}
            />
            <Button sx={{ mt:3 }} variant="contained" size="large" type="submit" fullWidth disabled={!isValid || isPointReportSaving}>
                Сохранить отметку
            </Button>
            {!isValid && <Alert severity="warning" sx={{my: 3}} >
                Вы находитесь слишком далеко от точки "{point.name}" ({formatDistance(dist)}, допустимо - {formatDistance(validation_distance)})
                </Alert>}
            {pointReportError && <Alert>{pointReportError}</Alert>}
        </form>
    </section>
}

export default AppCheckpoint;