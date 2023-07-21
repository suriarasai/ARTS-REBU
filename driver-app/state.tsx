import { atom, selector } from "recoil";

export const driverAtom = atom({
  key: "driver-atom",
  default: {},
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Driver Data (state.tsx): ", data);
      });
    },
  ],
});

export const driverSelector = selector({
  key: "driver-modifier",
  get: ({ get }) => {
    return get(driverAtom);
  },
});
