import { produceKafkaTaxiLocatorEvent } from "@/server";

export function pingCurrentLocation(
  tmdtid: number,
  driverID: number,
  taxiNumber: string
) {
  navigator.geolocation.getCurrentPosition((position) => {
    produceKafkaTaxiLocatorEvent(
      JSON.stringify({
        tmdtid: tmdtid,
        driverID: driverID,
        taxiNumber: taxiNumber,
        currentPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        availabilityStatus: false,
      })
    );
  });
}
