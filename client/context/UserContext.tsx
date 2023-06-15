// Defines a contextProvider to persist userData in the main app file

import { UserContextType } from "@/redux/types";
import { createContext } from "react";

const iUserContextState = {
    user: {},
    setUser: () => {}
}

export const UserContext = createContext<UserContextType>(iUserContextState);