import { atom } from "recoil";
import {
  BookingEvent,
  DispatchEvent,
  Driver,
  LocationEvent,
  Taxi,
} from "./types";

export const driverAtom = atom({
  key: "driver-atom",
  default: {} as Driver,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Driver Data (state.tsx): ", data);
        localStorage.setItem("driver", JSON.stringify(data));
      });
    },
  ],
});

export const taxiAtom = atom({
  key: "taxi-atom",
  default: {} as Taxi,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Taxi Data (state.tsx): ", data);
        localStorage.setItem("taxi", JSON.stringify(data));
      });
    },
  ],
});

export const dispatchAtom = atom({
  key: "dispatch-atom",
  default: {} as DispatchEvent,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Dispatch Data (state.tsx): ", data);
        localStorage.setItem("dispatch", JSON.stringify(data));
      });
    },
  ],
});

export const bookingAtom = atom({
  key: "booking-atom",
  default: {} as BookingEvent,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Booking Data (state.tsx): ", data);
        localStorage.setItem("booking", JSON.stringify(data));
      });
    },
  ],
});

export const locationAtom = atom({
  key: "location-atom",
  default: {} as LocationEvent,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Location Data (state.tsx): ", data);
      });
    },
  ],
});

export const screenAtom = atom({
  key: "screen-atom",
  default: "" as string,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Screen State (state.tsx): ", data);
        localStorage.setItem("screen", JSON.stringify(data));
      });
    },
  ],
});

export const routesAtom = atom({
  key: "routes-atom",
  default: {
    pickup: null,
    dropoff: null,
  },
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Routes State (state.tsx): ", data);
        localStorage.setItem("routes", JSON.stringify(data));
      });
    },
  ],
});
