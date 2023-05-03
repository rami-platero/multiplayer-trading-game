import { createContext, useState } from "react";
import { contextProps } from "../interfaces/interfaces";

export enum TransitionFrom {
  none="",
  shop = "shop",
  selector = "selector",
}

interface ITransition {
  changeFrom: TransitionFrom;
  setChangeFrom: React.Dispatch<React.SetStateAction<TransitionFrom>>;
}

export const transitionContext = createContext<ITransition>({
  changeFrom: TransitionFrom.none,
  setChangeFrom: () => {},
});

const TransitionContextProvider = ({ children }: contextProps) => {
  const [changeFrom, setChangeFrom] = useState(TransitionFrom.none);

  return (
    <transitionContext.Provider value={{ changeFrom, setChangeFrom }}>
      {children}
    </transitionContext.Provider>
  );
};

export default TransitionContextProvider;
