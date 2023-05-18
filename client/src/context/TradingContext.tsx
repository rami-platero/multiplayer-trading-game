import {
  ContextProps,
  IGameState,
  IInventory,
  IUser,
} from "../interfaces/interfaces";
import {
  createContext,
  useState,
  useContext,
  useReducer,
  SetStateAction,
} from "react";
import { ErrorType, userContext } from "./UserContext";
import { OfferState, lobbyContext } from "./LobbyContext";
import {
  initalTradingItemsState,
  tradingReducer,
} from "../reducers/tradingReducer";

export enum OfferingState {
  Offering = "offering",
  Trading = "trading",
}

interface ITradingContext {
  offeringState: OfferingState;
  tradingWith: IUser | null;
  items: (IInventory | null)[];
  addItem: (item: IInventory) => void;
  setCurrentIndexItem: React.Dispatch<SetStateAction<number | null>>;
  closeTrade: ()=>void
}

export const tradingContext = createContext<ITradingContext>({
  offeringState: OfferingState.Offering,
  tradingWith: null,
  items: initalTradingItemsState.items,
  addItem: () => {},
  setCurrentIndexItem: () => {},
  closeTrade: () => {},
});

const TradingContextProvider = ({ children }: ContextProps) => {
  const [tradingState, tradingDispatch] = useReducer(
    tradingReducer,
    initalTradingItemsState
  );
  const [offeringState, setOfferingState] = useState<OfferingState>(
    OfferingState.Offering
  );
  const [currentIndexItem, setCurrentIndexItem] = useState<number | null>(null);
  const [tradingWith, setTradingWith] = useState<IUser | null>(null);
  const { socket, setErrorMessage, authDispatch, setGameState, user } =
    useContext(userContext);
  const {
    lobby,
    isTrading,
    offerState,
    closeOffer,
    currentTradeOffer,
    setIsTrading,
    setCurrentTradeOffer
  } = useContext(lobbyContext);
  const { closeInventory } = useContext(userContext);

  const displayTrader = (trader: IUser) => {
    setTradingWith(trader);
    setOfferingState(OfferingState.Trading);
  };

  socket?.off("new-trader").on("new-trader", (trader) => displayTrader(trader));

  socket?.off("trader-leaves").on("trader-leaves", () => {
    setOfferingState(OfferingState.Offering);
    setTradingWith(null);
    tradingDispatch({ type: "RESET" });
  });

  const addItem = (item: IInventory) => {
    const result = tradingState.items.some((it) => {
      return it?.itemId.name == item.itemId.name;
    });
    if (!result && item.itemId._id !== currentTradeOffer?.itemOffering._id) {
      closeInventory();
      tradingDispatch({
        type: "ADD_ITEM",
        payload: { item, index: currentIndexItem! },
      });
      socket?.emit("TRADER:ADD-ITEM", {
        item: item.itemId,
        socketID: currentTradeOffer?.createdBy.socketID,
        index: currentIndexItem,
      });
      setCurrentIndexItem(null);
    }
  };

  const closeTrade = () => {
    setIsTrading(false);
    socket?.emit("USER:CLOSE_TRADE", currentTradeOffer);
    setTimeout(() => {
      setCurrentTradeOffer(null);
      tradingDispatch({type: "RESET"})
    }, 300);
  };

  function handleSocketUserEvents() {
    socket?.off("error").on("error", ({ message, type }) => {
      switch (type) {
        case ErrorType.DuplicateLogin:
          setErrorMessage(message);
          if (lobby) {
            socket?.emit("leave-lobby", {
              _id: user?._id,
              lobby: lobby?.name,
            });
            offerState == OfferState.Offering && closeOffer();
            isTrading && closeTrade();
          }
          authDispatch({ type: "LOG_OUT" });
          setGameState(IGameState.Auth);
          break;

        default:
          break;
      }
    });
  }
  handleSocketUserEvents();

  socket?.off("TRADE:ADD-ITEM").on("TRADE:ADD-ITEM", (obj) => {
    tradingDispatch({ type: "ADD_ITEM", payload: obj });
  });

  return (
    <tradingContext.Provider
      value={{
        offeringState,
        tradingWith,
        ...tradingState,
        addItem,
        setCurrentIndexItem,
        closeTrade
      }}
    >
      {children}
    </tradingContext.Provider>
  );
};

export default TradingContextProvider;
