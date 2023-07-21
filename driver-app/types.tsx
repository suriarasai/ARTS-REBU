export interface BookingEvent {
  customerID?: number;
  customerName: string;
  phoneNumber?: number;
  pickUpLocation: {
    placeID?: string;
    lat?: number;
    lng?: number;
    postcode: string;
    address: string;
    placeName: string;
  };
  taxiPassengerCapacity?: number;
  pickUpTime?: number;
  dropLocation: {
    placeID?: string;
    lat?: number;
    lng?: number;
    postcode: string;
    address: string;
    placeName: string;
  };
  taxiType?: string;
  fareType?: string;
  fare?: number;
  eta: number;
  distance: number;
  paymentMethod?: string;
  status?: string;
  dropTime?: number;
  bookingID?: number;
  rating?: number;
}

export type DispatchEvent = {
  tmdtid: number;
  taxiNumber: string;
  taxiMakeModel: string;
  driverID: number;
  driverName: string;
  driverPhoneNumber: number;
  taxiColor: string;
  sno: number;
};

export type Driver = {
  driverID: number;
  driverName: string;
  phoneNumber: number;
  taxiID: number;
  rating: number;
};
