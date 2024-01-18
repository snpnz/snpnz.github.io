import React, {HTMLAttributes} from 'react';
import {Alert, Box, CircularProgress, Link, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointsAction} from "../../store/main.slice";
import 'leaflet.offline';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
// @ts-ignore
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {mapBoxAttribution, osmTilesUrl, winterPistesTilesUrl} from "./const";
import {LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import {LocateControl} from "./LocateControl";

const AppMap: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const mapStyle = { height: 'calc(100dvh - 64px)', width: '100%', padding: 0 };

    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();

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

    return <MapContainer center={[53.13741, 45.32191]} zoom={13}  style={mapStyle} attributionControl={false}>
        <TileLayer
            attribution={mapBoxAttribution}
            url={osmTilesUrl}
        />
        <LayersControl position="topright">
            <LayersControl.BaseLayer name={"OSM"} checked>
                <TileLayer
                    attribution={mapBoxAttribution}
                    url={osmTilesUrl}
                />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name={"Наложение лыжной карты"} checked>
                <TileLayer
                    attribution={mapBoxAttribution}
                    url={winterPistesTilesUrl}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Контрольные точки" checked>
                <LayerGroup>{points.length > 0 && points.map((point) => {
                    const icon = L.divIcon({
                        className: 'map-marker',
                        html: `<span title="${point.name}"></span>`,
                        iconSize: [8, 8],
                        iconAnchor: [8, 8]
                    })
                    return <Marker key={point.id} position={[point.point[0], point.point[1]]} icon={icon}>
                        <Tooltip>{point.name}</Tooltip>
                        <Popup>
                            <Typography variant="subtitle1" sx={{m: 0}}>
                                {point.name}
                            </Typography>
                            <Typography variant="body2" sx={{m: 0}}>
                                {point.description}
                            </Typography>
                            <Typography variant="body2" sx={{m: 0}}>
                                Координыты: <Link href={`geo:${point.point}`}>{point.point.join(', ')}</Link>
                            </Typography>
                        </Popup>
                    </Marker>
                })}
                </LayerGroup>
            </LayersControl.Overlay>
        </LayersControl>
        <LocateControl position="topright" />
    </MapContainer>

}

export default AppMap;
