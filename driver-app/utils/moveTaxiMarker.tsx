import { produceKafkaTaxiLocatorEvent } from "@/server";
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
        availabilityStatus: true,
      })
    );

    window.setTimeout(function () {
      MoveTaxiMarker(polyline, iter + 1, driver, taxi, _callback);
    }, 125);
  } else {
    // the taxi has 'arrived'
    _callback();
  }
}
