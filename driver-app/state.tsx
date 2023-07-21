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

export const dispatchAtom = atom({
  key: "dispatch-atom",
  default: {},
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.log("Updated Dispatch Data (state.tsx): ", data);
      });
    },
  ],
});

export const dispatchSelector = selector({
  key: "dispatch-modifier",
  get: ({ get }) => {
    return get(dispatchAtom);
  },
});
