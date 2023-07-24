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
  customerID: number;
  customerName: string;
  customerPhoneNumber: number;
  pickUpLocation: Location;
  dropLocation: Location;
  status: string;
  tmdtid: number;
  taxiNumber: string;
  taxiPassengerCapacity: number;
  taxiMakeModel: string;
  taxiColor: string;
  driverID: number;
  driverName: string;
  driverPhoneNumber: number;
  sno: number;
  rating: number;
};

export type LocationEvent = {
  tmdtid: number;
  driverID: number;
  taxiNumber: string;
  currentPosition: LatLng;
  availabilityStatus: boolean;
};

type LatLng = {
  lat: number;
  lng: number;
};

export type Driver = {
  driverID: number;
  driverName: string;
  phoneNumber: number;
  taxiID: number;
  rating: number;
};

export interface Location {
  placeID?: string;
  lat?: number;
  lng?: number;
  postcode?: number;
  address?: string;
  placeName?: string;
}

export interface Taxi {
  sno: number;
  taxiNumber: string;
  taxiType: string;
  tmdtid: number;
  taxiFeature: taxiFeature;
  registeredDrivers?: registeredDrivers[];
}

interface taxiFeature {
  taxiMakeModel: string;
  taxiPassengerCapacity: 1 | 2 | 3 | 4 | 5 | 6;
  taxiColor: string;
}

interface registeredDrivers {
  driverID: number;
  driverName: string;
  driverPhone: number;
}
