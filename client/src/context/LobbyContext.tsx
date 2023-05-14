import {
  createContext,
  useReducer,
  useState,
  SetStateAction,
  useContext,
} from "react";
import {
  ContextProps,
  IOffer,
  IUserinLobby,
  Item,
  Lobby,
} from "../interfaces/interfaces";
import {
  LobbyActionType,
  LobbyInitialState,
  lobbyReducer,
} from "../reducers/lobbyReducer";
import { userContext } from "./UserContext";

export enum InventoryState {
  Offer = "offer",
  Trading = "trading",
}

export enum OfferState {
  None = "none",
  Offering = "offering",
}

interface ILobbyContext {
  lobby: Lobby | null;
  lobbyDispatch: React.Dispatch<LobbyActionType>;
  lobbyUsers: IUserinLobby[] | null;
  offers: IOffer[] | null;
  setInventoryState: React.Dispatch<SetStateAction<InventoryState | null>>;
  inventoryState: InventoryState | null;
  offerState: OfferState;
  makeOffer: (item: Item) => void;
  closeOffer: () => void;
  itemOffering: Item | null;
  openOffer: (offer: IOffer)=>void;
  isTrading: boolean;
  closeTrade: () => void
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
  lobbyUsers: [],
  offers: [],
  setInventoryState: (): void => {},
  inventoryState: null,
  offerState: OfferState.None,
  makeOffer: () => {},
  closeOffer: () => {},
  itemOffering: null,
  openOffer: () => {},
  isTrading: false,
  closeTrade: ()=>{}
});

const LobbyContextProvider = ({ children }: ContextProps) => {
  const [lobbyState, lobbyDispatch] = useReducer(
    lobbyReducer,
    LobbyInitialState
  );
  const [inventoryState, setInventoryState] = useState<InventoryState | null>(
    null
  );
  const [offerState, setOfferState] = useState<OfferState>(OfferState.None);
  const [itemOffering, setItemOffering] = useState<Item | null>(null);
  const { socket, user } = useContext(userContext);
  const [currentTradeOffer, setCurrentTradeOffer] = useState<IOffer | null>(null)
  const [isTrading, setIsTrading] = useState(false)

  const makeOffer = (item: Item) => {
    setInventoryState(null);
    setItemOffering(item);
    setOfferState(OfferState.Offering);
    socket?.emit("new-offer", { item, user });
  };

  const closeOffer = () => {
    setItemOffering(null);
    setOfferState(OfferState.None);
    socket?.emit("close-offer", itemOffering?._id);

    // To remove the offer instantly (only for the one offering)
    lobbyDispatch({ type: "REMOVE_OFFER", payload: itemOffering?._id! });
  };

  const openOffer = (offer: IOffer)=>{
    setIsTrading(true)
    setCurrentTradeOffer(offer)
    socket?.emit('USER:OPEN_OFFER', {offer,user})
  }

  const closeTrade = ()=>{
    setIsTrading(false)
    socket?.emit('USER:CLOSE_TRADE', currentTradeOffer)
    setCurrentTradeOffer(null)
  }

  return (
    <lobbyContext.Provider
      value={{
        ...lobbyState,
        lobbyDispatch,
        inventoryState,
        setInventoryState,
        offerState,
        makeOffer,
        closeOffer,
        itemOffering,
        openOffer,
        isTrading,
        closeTrade
      }}
    >
      {children}
    </lobbyContext.Provider>
  );
};

export default LobbyContextProvider;
