import { ContextProps, IOffer } from "../interfaces/interfaces";
import { createContext, useState,SetStateAction } from "react";

interface ITradingContext {
}

export const tradingContext = createContext<ITradingContext>({
});

const TradingContextProvider = ({ children }: ContextProps) => {

  return (
    <tradingContext.Provider value={{ }}>
      {children}
    </tradingContext.Provider>
  );
};

export default TradingContextProvider