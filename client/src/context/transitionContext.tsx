import { createContext, useState } from "react";
import { ContextProps } from "../interfaces/interfaces";
import './transitions.css'

export enum TransitionFrom {
  none = "",
  shop = "shop",
  selector = "selector",
}

interface ITransition {
  changeFrom: TransitionFrom;
  setChangeFrom: React.Dispatch<React.SetStateAction<TransitionFrom>>;
  selectorTimeout: number;
  setSelectorTimeout: React.Dispatch<React.SetStateAction<number>>;
}

export const transitionContext = createContext<ITransition>({
  changeFrom: TransitionFrom.none,
  setChangeFrom: () => {},
  selectorTimeout: 300,
  setSelectorTimeout: () => {},
});

const TransitionContextProvider = ({ children }: ContextProps) => {
  const [changeFrom, setChangeFrom] = useState(TransitionFrom.none);
  const [selectorTimeout, setSelectorTimeout] = useState(300);

  return (
    <transitionContext.Provider
      value={{ changeFrom, setChangeFrom, selectorTimeout, setSelectorTimeout }}
    >
      {children}
    </transitionContext.Provider>
  );
};

export default TransitionContextProvider;
