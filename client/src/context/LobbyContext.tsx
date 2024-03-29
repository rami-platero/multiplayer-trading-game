import {
  createContext,
  useReducer,
  useState,
  useContext,
  SetStateAction,
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
import { InventoryState, userContext } from "./UserContext";

export enum OfferState {
  None = "none",
  Offering = "offering",
}

interface ILobbyContext {
  lobby: Lobby | null;
  lobbyDispatch: React.Dispatch<LobbyActionType>;
  lobbyUsers: IUserinLobby[] | null;
  offers: IOffer[] | null;
  offerState: OfferState;
  makeOffer: (item: Item) => void;
  closeOffer: () => void;
  itemOffering: Item | null;
  openOffer: (offer: IOffer) => void;
  isTrading: boolean;
  currentTradeOffer: IOffer | null;
  setIsTrading: React.Dispatch<SetStateAction<boolean>>
  setCurrentTradeOffer: React.Dispatch<SetStateAction<IOffer | null>>
  setOfferState: React.Dispatch<SetStateAction<OfferState>>
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
  lobbyUsers: [],
  offers: [],
  offerState: OfferState.None,
  makeOffer: () => {},
  closeOffer: () => {},
  itemOffering: null,
  openOffer: () => {},
  isTrading: false,
  currentTradeOffer: null,
  setIsTrading: ()=>{},
  setCurrentTradeOffer: ()=>{},
  setOfferState: ()=>{}
});

const LobbyContextProvider = ({ children }: ContextProps) => {
  const [lobbyState, lobbyDispatch] = useReducer(
    lobbyReducer,
    LobbyInitialState
  );
  const [offerState, setOfferState] = useState<OfferState>(OfferState.None);
  const [itemOffering, setItemOffering] = useState<Item | null>(null);
  const { socket, user,setInventoryState,closeInventory } = useContext(userContext);
  const [currentTradeOffer, setCurrentTradeOffer] = useState<IOffer | null>(
    null
  );
  const [isTrading, setIsTrading] = useState(false);

  socket?.off("user:leaves").on("user-leaves", (id) => {
    lobbyDispatch({ type: "USER:LEAVES", payload: id });
  });

  const makeOffer = (item: Item) => {
    closeInventory()
    setInventoryState(null);
    setItemOffering(item);
    setOfferState(OfferState.Offering);
    socket?.emit("new-offer", { item, user });
  };

  const closeOffer = () => {
    // To remove the offer instantly (only for the one offering)
    lobbyDispatch({ type: "REMOVE_OFFER", payload: itemOffering?._id! });
    setItemOffering(null);
    setOfferState(OfferState.None);
    socket?.emit("close-offer", itemOffering?._id);

  };

  const openOffer = (offer: IOffer) => {
    if(!isTrading && currentTradeOffer==null){
      socket?.emit("USER:OPEN_OFFER", { offer, user });
      setInventoryState(InventoryState.Trading)
      setIsTrading(true);
      setCurrentTradeOffer(offer);
    }
  };


  return (
    <lobbyContext.Provider
      value={{
        ...lobbyState,
        lobbyDispatch,
        offerState,
        makeOffer,
        closeOffer,
        itemOffering,
        openOffer,
        isTrading,
        currentTradeOffer,
        setIsTrading,
        setCurrentTradeOffer,
        setOfferState
      }}
    >
      {children}
    </lobbyContext.Provider>
  );
};

export default LobbyContextProvider;
