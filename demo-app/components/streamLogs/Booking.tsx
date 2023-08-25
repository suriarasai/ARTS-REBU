export class Booking {
  readonly bookingID: number;
  customerID: number;
  pickUpLocation: string;
  dropLocation: string;
  driverID: number | null;
  taxiNumber: string | null;
  status: string;
  messageReceivedTime: string;

  constructor(
    bookingID: number,
    customerID: number,
    pickUpLocation: string,
    dropLocation: string
  ) {
    this.bookingID = bookingID;
    this.customerID = customerID;
    this.pickUpLocation = pickUpLocation;
    this.dropLocation = dropLocation;
    this.status = "requested";
    this.messageReceivedTime = new Date()
      .toTimeString()
      .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

    this.driverID = null;
    this.taxiNumber = null;
  }

  public dispatchBooking(driverID: number, taxiNumber: string) {
    this.status = "dispatched";

    this.driverID = driverID;
    this.taxiNumber = taxiNumber;
  }

  public completeBooking() {
    this.status = "completed";
  }

  public cancelBooking() {
    this.status = "cancelled";
  }
}

interface LocationInterface {
  address: string;
  lat?: number;
  lng?: number;
  postcode?: string;
  placeName?: string;
  placeID?: string;
}
