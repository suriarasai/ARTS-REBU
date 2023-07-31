import { produceKafkaChatEvent, produceKafkaTaxiLocatorEvent } from "@/server";
import { markers } from "../pages/map";
import { Driver, Taxi } from "@/types";

export function MoveTaxiMarker(
  polyline: any,
  iter: number,
  driver: Driver,
  taxi: Taxi,
  _callback: Function
) {
  if (polyline.length - 1 >= iter) {
    markers.taxiLocation.setPosition(polyline[iter]);

    produceKafkaTaxiLocatorEvent(
      JSON.stringify({
        tmdtid: taxi.tmdtid,
        driverID: driver.driverID,
        taxiNumber: taxi.taxiNumber,
        currentPosition: {
          lat: polyline[iter].lat(),
          lng: polyline[iter].lng(),
        },
        availabilityStatus: false,
      })
    );

    window.setTimeout(function () {
      MoveTaxiMarker(polyline, iter + 1, driver, taxi, _callback);
    }, 250);
  } else {
    // the taxi has 'arrived'
    _callback();
  }
}
