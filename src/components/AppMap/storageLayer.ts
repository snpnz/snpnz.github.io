// @ts-ignore
import { getStorageInfo, getStoredTilesAsJson } from 'leaflet.offline';
// @ts-ignore
import * as L from 'leaflet';
import { urlTemplate } from './const';
import {notifyWithState} from "../../helpers/notificationHelper";


export default function storageLayer(baseLayer: any, layerswitcher: any) {
    let layer: any;

    const getGeoJsonData = () => getStorageInfo(urlTemplate)
        .then((tiles: any) => getStoredTilesAsJson(baseLayer, tiles));

    const addStorageLayer = () => {
        getGeoJsonData().then((geojson: any) => {
            layer = L.geoJSON(geojson).bindPopup(
                (clickedLayer: any) => clickedLayer.feature.properties.key,
            );
            layerswitcher.addOverlay(layer, 'stored tiles');
        });
    };

    addStorageLayer();

    baseLayer.on('storagesize', (e: any) => {
        notifyWithState('info', 'Сохраненных фрагментов карты: ' + e.storagesize);
        if (layer) {
            layer.clearLayers();
            getGeoJsonData().then((data: any) => {
                layer.addData(data);
            });
        }
    });
}