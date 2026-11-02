import { createContext, useContext } from "react";

export const NotifyDataContext = createContext<unknown>(undefined);
export const useNotifyData = () => useContext(NotifyDataContext);
