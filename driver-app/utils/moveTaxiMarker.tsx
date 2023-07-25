import { markers } from "../pages/map";

export function MoveTaxiMarker(polyline: any, iter: number, _callback: Function) {
  if (polyline.length - 1 >= iter) {
    markers.taxiLocation.setPosition(polyline[iter]);

    window.setTimeout(function () {
      MoveTaxiMarker(polyline, iter + 1, _callback);
    }, 125);
  } else {
    // the taxi has 'arrived'
    _callback();
  }
}
