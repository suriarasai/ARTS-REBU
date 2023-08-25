import { LocationInterface } from "@/types";
import { atom } from "recoil";

export const originInputAtom = atom({
  key: "originInput-atom",
  default: {
    lat: 0,
    lng: 0,
    postcode: "",
  } as LocationInterface,
});

export const destinationInputAtom = atom({
  key: "destinationInput-atom",
  default: {
    lat: 0,
    lng: 0,
    postcode: "",
  } as LocationInterface,
});

export const taxiTypeAtom = atom({
  key: "taxiType-atom",
  default: "" as string,
});

export const pickupTimeAtom = atom({
  key: "pickupTime-atom",
  default: "" as string,
});

export const tripDetailsAtom = atom({
  key: "tripDetails-atom",
  default: {
    distance: 0,
    duration: 0,
    fare: {
      booking: "0.00",
      base: "0.00",
      metered: "0.00",
      peak: "0.00",
      location: "0.00",
      tempSurcharge: "0.00",
      total: "0.00",
    },
  },
});
