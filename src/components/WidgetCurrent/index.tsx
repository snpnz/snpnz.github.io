import React, {HTMLAttributes} from 'react';
import {Alert, Button, Link, Typography} from '@mui/material';
import {useAppSelector} from "../../store";
import {IPoint} from "../../types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {getDistanceBetweenPointsInMeters} from "../../helpers/distanceHelper";
import {getCurrentGeoLocationAsync} from "../../helpers/geoLocationHelper";
import {formatDistance} from "../../helpers/formatHelper";
import {useNavigate} from "react-router-dom";



const WidgetCurrent: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { points } = useAppSelector(s => s.main);
    const [latLng, setLatLng] = React.useState<[number, number] | null>(null);
    const [gpsErr, setGpsErr] = React.useState<string | null>(null);

    const navigate = useNavigate();

    const getLocation = async () => {
        try {
            const [lt, ln] = await getCurrentGeoLocationAsync();
            setGpsErr(null);
            setLatLng([lt, ln]);
        } catch (e) {
            setGpsErr((e as Error).message);
        }
    }

    React.useEffect(() => {
        getLocation().then();
    }, []);

    if (gpsErr || !latLng) {
        return <Alert severity="error" sx={{mt: 3}} action={
            <Button color="inherit" onClick={() => getLocation()} size="small">
                Обновить геопозицию
            </Button>
        }>Ошибка получения геопозиции. {gpsErr}</Alert>
    }

    const distPoints = points
        ?.map((x: IPoint) => ({...x, dist: getDistanceBetweenPointsInMeters([x.point[0], x.point[1]], latLng)}))
        ?.sort(function(a,b) {
            return a.dist - b.dist;
        });


        if (!distPoints?.length) {
            return null;
        }

    const dist = getDistanceBetweenPointsInMeters([distPoints[0].point[0], distPoints[0].point[1]], latLng);

    return <Box sx={{ minWidth: 275, mt:2 }}>
                <Card variant="outlined">
                    <CardContent>
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                До ближайшей точки {formatDistance(dist)}
                            </Typography>
                            <Typography variant="body2">
                                <Link href={`geo:${distPoints[0].point.join(',')}`}>
                                    {distPoints[0].point.map(x => x.toFixed(5)).join(', ')}
                                </Link>
                            </Typography>
                        </div>
                        <Typography variant="h5" component="div">
                            {distPoints[0].name}
                        </Typography>
                        <Typography variant="body2">
                            {distPoints[0].description}
                        </Typography>
                        {dist < 501 && <Button  variant="contained" sx={{ mt: 2 }} fullWidth  size="small" onClick={() => {
                            navigate('/add');
                        }}>Отметиться на точке</Button>}
                    </CardContent>
                </Card>
            </Box>
}

export default WidgetCurrent;
