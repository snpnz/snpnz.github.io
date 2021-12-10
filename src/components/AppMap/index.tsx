import React, {HTMLAttributes} from 'react';
import {Alert, Box, CircularProgress} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../store";
import Button from "@mui/material/Button";
import {getRemotePointsAction} from "../../store/main.slice";
import 'leaflet.offline';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
// @ts-ignore
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import storageLayer from './storageLayer';
import {notifyWithState} from "../../helpers/notificationHelper";
export const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


const AppMap: React.FC<HTMLAttributes<HTMLDivElement>> = () => {
    const { points, isPointsLoading, pointsLoadingError } = useAppSelector(s => s.main);
    const dispatch = useAppDispatch();
    const mapContainerRef = React.useRef(null);

    React.useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }
        const map = new L.Map(mapContainerRef.current);
        const baseLayer = L.tileLayer
            .offline(urlTemplate, {
                attribution: 'Map data {attribution.OpenStreetMap}',
                subdomains: 'abc',
                minZoom: 8,
            })
            .addTo(map);
// add buttons to save tiles in area viewed
        const control = L.control.savetiles(baseLayer, {
            //zoomlevels: [14, 18], // optional zoomlevels to save, default current zoomlevel
            confirm(layer: any, successCallback: any) {
                // eslint-disable-next-line no-alert
                if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
                    successCallback();
                }
            },
            confirmRemoval(layer: any, successCallback: any) {
                // eslint-disable-next-line no-alert
                if (window.confirm('Remove all the tiles?')) {
                    successCallback();
                }
            },
            saveText: 'SV',
            rmText: 'RM',
        });
        control.addTo(map);

        L.control.locate({
            position: 'topright',
            strings: {
                title: "Show me where I am, yo!"
            }
        }).addTo(map);

        // getCurrentGeoLocationAsync().then(([lat, lng]) => {
        //     map.setView({ lat, lng }, 16)
        // });
// layer switcher control
        const layerswitcher = L.control
            .layers({
                'osm (offline)': baseLayer,
            }, null, { collapsed: false, position: 'bottomleft'})
            .addTo(map);
// add storage overlay
        storageLayer(baseLayer, layerswitcher);

        let progress = 0;
        baseLayer.on('savestart', (e: any) => {
            progress = 0;
            notifyWithState('info', 'Сохраняем ' + e._tilesforSave.length);
        });
        baseLayer.on('savetileend', () => {
            progress += 1;
            notifyWithState('info', progress.toString());
        });

        if (points.length) {
            const boundCoordinates: Array<[number,number]> = [];

            points.forEach(point => {
                boundCoordinates.push([point.point[0], point.point[1]]);
                const icon = L.divIcon({
                    className: 'map-marker',
                    html: `<span title="${point.name}"></span>`,
                    iconSize: [8, 8],
                    iconAnchor: [4, 4]
                });
                L.marker([point.point[0], point.point[1]], {icon}).addTo(map).bindPopup(point.name);
            })
            const bounds = L.latLngBounds(boundCoordinates);
            if (bounds.isValid()) { map.fitBounds(bounds); } else {
                notifyWithState('error', boundCoordinates.join(','))
            }
        }

    }, [mapContainerRef, points])

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

    return <div
        ref={mapContainerRef}
        style={{width: '100vw', height: 'calc(100vh - 64px)', margin: '0 -24px'}}
    />

}

export default AppMap;