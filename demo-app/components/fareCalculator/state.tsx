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
    fare: "0",
  },
});
