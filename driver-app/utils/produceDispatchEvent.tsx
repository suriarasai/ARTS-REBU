import { produceKafkaDispatchEvent } from "@/server";
import { BookingEvent, Driver, Taxi } from "@/types";

// Dispatch stream producer: Approving a ride request
export function produceDispatchEvent(
  booking: BookingEvent,
  taxi: Taxi,
  driver: Driver
) {
  produceKafkaDispatchEvent(
    JSON.stringify({
      customerID: booking.customerID,
      customerName: booking.customerName,
      customerPhoneNumber: booking.phoneNumber,
      pickUpLocation: booking.pickUpLocation,
      dropLocation: booking.dropLocation,
      status: "dispatched",
      tmdtid: taxi.tmdtid,
      taxiNumber: taxi.taxiNumber,
      taxiPassengerCapacity: taxi.taxiFeature.taxiPassengerCapacity,
      taxiMakeModel: taxi.taxiFeature.taxiMakeModel,
      taxiColor: taxi.taxiFeature.taxiColor,
      driverID: driver.driverID,
      driverName: driver.driverName,
      driverPhoneNumber: driver.phoneNumber,
      sno: taxi.sno,
      rating: driver.rating,
    })
  );
}
