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
import {addPointReportAction, getRemotePointsAction} from '../../store/main.slice';
import {IPoint} from "../../types";
import {getSQLDate} from "../../helpers/dateHelper";



const AppCheckpoint: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const [comment, setComment] = React.useState<string>('');
    const [code, setCode] = React.useState<string|null>(null);
    const [lat, setLat] = React.useState<number | null>(null);
    const [lng, setLng] = React.useState<number | null>(null);
    const [gpsErr, setGpsErr] = React.useState<string | null>(null);
    const [point, setPoint] = React.useState<IPoint | null>(null);

    const { points, isPointsLoading, pointsLoadingError, isPointReportSaving, pointReportError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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

    const location = useLocation();

    React.useEffect(() => {
        if (location.search) {
            const searchParams = new URLSearchParams(location.search.substr(1));

            if(searchParams.has("code")){
                setCode(searchParams.get("code"));
            }
        }
    }, [location]);


    const getLocation = () => {
        if (!navigator.geolocation) {
            setGpsErr('Geolocation is not supported by your browser');
        } else {

            navigator.permissions.query({name:'geolocation'}).then(function(result) {
                if (result.state === 'denied') {
                    setGpsErr('Нужно дать разрешение доступа к геопозиции');
                }
            });

            navigator.geolocation.getCurrentPosition((position) => {
                setGpsErr(null);
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }, () => {
                setGpsErr('Unable to retrieve your location');
            });
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
        dispatch(addPointReportAction({
            id_point: point!.id.toString(),
            coordinates: [lat, lng].join(','),
            comment,
            created_at: getSQLDate(new Date())
        }))

        window.navigator.vibrate(300);
        setTimeout(() => navigate('/my'), 1000);
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
    const distPoints = points
        .map((x: IPoint) => ({...x, dist: getDistanceBetweenPointsInMeters([x.point[0], x.point[1]], [lat, lng])}))
        .sort(function(a,b) {
            return a.dist - b.dist;
        });




    if (!code || !point) {
        return <Autocomplete
            sx={{ mt: 4 }}
            fullWidth
            options={distPoints}
            onChange={(e, v) => {
                setCode(v?.code || '');
            }}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
                return (<ListItem {...props}>
                    <ListItemText primary={option.name} secondary={formatDistance(option.dist)}/>
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

    const dist = getDistanceBetweenPointsInMeters([point.point[0], point.point[1]], [lat, lng])

    return <section>
        <Box sx={{ minWidth: 275, mt:2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Целевая точка
                    </Typography>
                    <Typography variant="h5" component="div">
                        {point.name}
                    </Typography>
                    <Typography variant="body2">
                        {point.description}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
        <Box sx={{ minWidth: 275, mt:2, mb: 2 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Текущая точка
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
            <TextField
                label="Комментарий (не обязательно)"
                multiline
                maxRows={4}
                value={comment}
                onChange={onChange}
                sx={{ mt: 2 }}
                fullWidth
                autoFocus
            />
            <Button sx={{ mt:3 }} variant="contained" size="large" type="submit" fullWidth disabled={isPointReportSaving}>
                Сохранить отметку
            </Button>
            {pointReportError && <Alert>{pointReportError}</Alert>}
        </form>
    </section>
}

export default AppCheckpoint;