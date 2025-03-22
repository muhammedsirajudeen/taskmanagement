'use client'
import { createContext } from "react";
export const GlobalContext=createContext({count:0})
export default function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <GlobalContext.Provider value={{ count: 0 }}>
        {children}
        </GlobalContext.Provider>
    );
}