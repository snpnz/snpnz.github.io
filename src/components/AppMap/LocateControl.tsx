import { createControlComponent } from '@react-leaflet/core';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';



interface P extends L.ControlOptions {}

function createLocateInstance(props: P) {
    const instance = new L.Control.Locate(props);

    return instance;
}

export const LocateControl = createControlComponent(createLocateInstance);

// Could also be simplified to:
/*
export const LocateControl = createControlComponent((props: P) => {
  return new Locate(props);
})
*/
