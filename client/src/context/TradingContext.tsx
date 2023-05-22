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

export enum OfferingState {
  Offering = "offering",
  Trading = "trading",
}

export interface TradeFlags {
  isTradeLocked: boolean,
  coinsLocked: boolean
}

export const tradeFlagsInitialState = {
  isTradeLocked: false,
  coinsLocked: false
}

export interface ITradeMessage  {
  username?: string,
  description: string,
  reason: string,
  dismissed: boolean
}

export const tradeMessageInitialState = {
  description: "",
  reason: "",
  dismissed: true
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
  lockOffer: ()=>void
  tradeFlags: TradeFlags
  unlockOffer: ()=>void
  setTradeFlags: React.Dispatch<SetStateAction<TradeFlags>>
  lockCoins: (coins:number)=>void
  coins: number
  rejectUser: ()=>void
  tradeMessage: ITradeMessage | null
  setTradeMessage: React.Dispatch<SetStateAction<ITradeMessage>>
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
  currentIndexItem: null,
  lockOffer: ()=>{},
  tradeFlags: tradeFlagsInitialState,
  unlockOffer: ()=>{},
  setTradeFlags: ()=>{},
  lockCoins: ()=>{},
  coins: 0,
  rejectUser: ()=>{},
  tradeMessage: tradeMessageInitialState,
  setTradeMessage: ()=>{}
});

const TradingContextProvider = ({ children }: ContextProps) => {
  const [tradingState, tradingDispatch] = useReducer(
    tradingReducer,
    initalTradingItemsState
  );
  // SELLER
  const [offeringState, setOfferingState] = useState<OfferingState>(
    OfferingState.Offering
  );
  //
  const [currentIndexItem, setCurrentIndexItem] = useState<number | null>(null);
  // BUYER
  const [tradingWith, setTradingWith] = useState<IUser | null>(null);
  //
  const [tradeFlags, setTradeFlags] = useState<TradeFlags>(tradeFlagsInitialState)
  const [tradeMessage, setTradeMessage] = useState<ITradeMessage>(tradeMessageInitialState)
  const { socket, setErrorMessage, authDispatch, setGameState, user,setInventoryState } =
    useContext(userContext);
  const {
    lobby,
    isTrading,
    offerState,
    closeOffer,
    currentTradeOffer,
    setIsTrading,
    setCurrentTradeOffer,
    offers
  } = useContext(lobbyContext);

  const closeTrade = () => {
    setIsTrading(false);
    setInventoryState(InventoryState.Offer);
    setTimeout(() => {
      setTradeFlags(tradeFlagsInitialState)
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

  const lockOffer = ()=>{
    setTradeFlags((prevFlags)=>({
      ...prevFlags,isTradeLocked: true
    }))
    socket?.emit("TRADER:LOCKS_OFFER", currentTradeOffer?.createdBy.socketID)
  }

  const unlockOffer = ()=>{
    setTradeFlags((prevFlags)=>({
      ...prevFlags,isTradeLocked: false
    }))
    socket?.emit("SELLER:UNLOCKS_OFFER", tradingWith?.socketID)
  }

  const lockCoins = (coins:number)=>{
    setTradeFlags((prevFlags)=>({
      ...prevFlags,coinsLocked: true
    }))
    socket?.emit("TRADER:LOCKS_COINS", {socketID: currentTradeOffer?.createdBy.socketID, coins})
  }

  const rejectUser = ()=>{
    setTradeFlags(tradeFlagsInitialState)
    setOfferingState(OfferingState.Offering);
    setTradingWith(null);
    tradingDispatch({ type: "RESET" });
    const foundOffer = offers?.find((offer)=>{
      return offer.createdBy.username === user?.username
    })
    socket?.emit("SELLER:REJECTS", {offerID: foundOffer?._id, buyer: tradingWith?.socketID})
  }

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
        currentIndexItem,
        lockOffer,
        tradeFlags,
        unlockOffer,
        setTradeFlags,
        lockCoins,
        rejectUser,
        tradeMessage,
        setTradeMessage
      }}
    >
      {children}
    </tradingContext.Provider>
  );
};

export default TradingContextProvider;
