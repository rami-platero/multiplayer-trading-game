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
import { ErrorType, InventoryState, userContext } from "./UserContext";
import { OfferState, lobbyContext } from "./LobbyContext";
import {
  TradingActionType,
  initalTradingItemsState,
  tradingReducer,
} from "../reducers/tradingReducer";
import { place_item_SFX } from "../components/SFX";

export enum OfferingState {
  Offering = "offering",
  Trading = "trading",
}

interface ITradingContext {
  offeringState: OfferingState;
  tradingWith: IUser | null;
  items: (IInventory | null)[];
  setCurrentIndexItem: React.Dispatch<SetStateAction<number | null>>;
  closeTrade: () => void;
  removeItem: (index: number) => void;
  addItemAmount: (item: IInventory, index: number) => void;
  setTradingWith: React.Dispatch<SetStateAction<IUser | null>>;
  setOfferingState: React.Dispatch<SetStateAction<OfferingState>>;
  tradingDispatch: React.Dispatch<TradingActionType>
  currentIndexItem: number | null
}

export const tradingContext = createContext<ITradingContext>({
  offeringState: OfferingState.Offering,
  tradingWith: null,
  items: initalTradingItemsState.items,
  setCurrentIndexItem: () => {},
  closeTrade: () => {},
  removeItem: () => {},
  addItemAmount: () => {},
  setTradingWith: () => {},
  setOfferingState: ()=>{},
  tradingDispatch: ()=>{},
  currentIndexItem: null
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
    setCurrentTradeOffer,
  } = useContext(lobbyContext);
  const { setInventoryState } = useContext(userContext);

  const closeTrade = () => {
    setIsTrading(false);
    setInventoryState(InventoryState.Offer);
    socket?.emit("USER:CLOSE_TRADE", currentTradeOffer);
    setTimeout(() => {
      setCurrentTradeOffer(null);
      tradingDispatch({ type: "RESET" });
    }, 300);
  };

  const removeItem = (index: number) => {
    tradingDispatch({ type: "REMOVE_ITEM", payload: index });
    socket?.emit("TRADER:REMOVE-ITEM", {
      index,
      socketID: currentTradeOffer?.createdBy.socketID,
    });
  };

  const addItemAmount = (item: IInventory, index: number) => {
    const userItem = user?.items.find((it) => {
      return it.itemId._id === item.itemId._id;
    });
    if (userItem?.count !== tradingState.items[index]?.count) {
      tradingDispatch({ type: "ADD_AMOUNT_ITEM", payload: index });
      socket?.emit("TRADER:ADDS_ITEM_AMOUNT", {
        index,
        socketID: currentTradeOffer?.createdBy.socketID,
      });
    }
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

  return (
    <tradingContext.Provider
      value={{
        offeringState,
        tradingWith,
        ...tradingState,
        setCurrentIndexItem,
        closeTrade,
        removeItem,
        addItemAmount,
        setTradingWith,
        setOfferingState,
        tradingDispatch,
        currentIndexItem
      }}
    >
      {children}
    </tradingContext.Provider>
  );
};

export default TradingContextProvider;
