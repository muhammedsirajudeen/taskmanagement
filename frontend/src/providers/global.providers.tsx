"use client";
import { User } from "@/types";
import { createContext, useContext, useState } from "react";

interface State {
  user: User | null;
  setUser: (user: User | null) => void;
}

const initialState: State = {
  user: null,
  setUser: () => {},
};

export const GlobalContext = createContext<State>(initialState);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
