import { createContext, useReducer, useState, SetStateAction, useContext } from "react";
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
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setInventoryState: React.Dispatch<SetStateAction<InventoryState | null>>;
  inventoryState: InventoryState | null;
  offerState: OfferState;
  openOffer: (item: Item) => void;
  closeOffer: () => void;
  itemOffering: Item | null
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
  lobbyUsers: [],
  offers: [],
  loading: false,
  setLoading: () => {},
  setInventoryState: (): void => {},
  inventoryState: null,
  offerState: OfferState.None,
  openOffer: () => {},
  closeOffer: () => {},
  itemOffering: null
});

const LobbyContextProvider = ({ children }: ContextProps) => {
  const [lobbyState, lobbyDispatch] = useReducer(
    lobbyReducer,
    LobbyInitialState
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [inventoryState, setInventoryState] = useState<InventoryState | null>(
    null
  );
  const [offerState, setOfferState] = useState<OfferState>(OfferState.None);
  const [itemOffering, setItemOffering] = useState<Item | null>(null);
  const {socket,user} = useContext(userContext)

  const openOffer = (item: Item) => {
    setInventoryState(null)
    setItemOffering(item);
    setOfferState(OfferState.Offering);
    socket?.emit('new-offer', {item,user})
  };

  const closeOffer = () => {
    setItemOffering(null);
    setOfferState(OfferState.None);
  };

  return (
    <lobbyContext.Provider
      value={{
        ...lobbyState,
        lobbyDispatch,
        loading,
        setLoading,
        inventoryState,
        setInventoryState,
        offerState,
        openOffer,
        closeOffer,
        itemOffering
      }}
    >
      {children}
    </lobbyContext.Provider>
  );
};

export default LobbyContextProvider;
