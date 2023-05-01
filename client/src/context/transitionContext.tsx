import { createContext, useState } from "react";
import { contextProps } from "../interfaces/interfaces";

interface ITransition {
  fromShop: boolean;
  setFromShop: React.Dispatch<React.SetStateAction<boolean>>;
}

export const transitionContext = createContext<ITransition>({
  fromShop: false,
  setFromShop: () => {},
});

const TransitionContextProvider = ({ children }: contextProps) => {
  const [fromShop, setFromShop] = useState(false);

  return (
    <transitionContext.Provider value={{ fromShop, setFromShop }}>
      {children}
    </transitionContext.Provider>
  );
};

export default TransitionContextProvider;
