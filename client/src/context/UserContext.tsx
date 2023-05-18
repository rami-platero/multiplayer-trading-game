import {
  createContext,
  useEffect,
  useReducer,
  useState,
  SetStateAction,
} from "react";
import { IUser } from "../interfaces/interfaces";
import { authReducer, initialState, ActionType } from "../reducers/authReducer";
import io, { Socket } from "socket.io-client";
import { IGameState } from "../interfaces/interfaces";
import { ContextProps } from "../interfaces/interfaces";
import { btn_click_SFX } from "../components/SFX";

export enum InventoryState {
  Offer = "offer",
  Trading = "trading",
}

interface IAuthContext {
  user: IUser | null;
  authDispatch: React.Dispatch<ActionType>;
  socketID: string | undefined;
  gameState: IGameState;
  setGameState: React.Dispatch<React.SetStateAction<IGameState>>;
  socket: Socket | null;
  errorMessage: string | null;
  closeErrorMessage: () => void;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<SetStateAction<string | null>>
  isInventoryOpen: boolean
  openInventory: ()=>void
  closeInventory: ()=>void
  setInventoryState: React.Dispatch<SetStateAction<InventoryState | null>>;
  inventoryState: InventoryState | null;
}

export enum ErrorType {
  DuplicateLogin = "duplicate login",
}

export const userContext = createContext<IAuthContext>({
  user: null,
  authDispatch: (): void => {},
  socketID: undefined,
  gameState: IGameState.Auth,
  setGameState: () => {},
  socket: null,
  errorMessage: null,
  closeErrorMessage: () => {},
  loading: false,
  setLoading: () => {},
  setErrorMessage: () => {},
  isInventoryOpen: false,
  openInventory: ()=>{},
  closeInventory: ()=>{},  
  setInventoryState: (): void => {},
  inventoryState: null,
});

export const UserContextProvider = ({ children }: ContextProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const [gameState, setGameState] = useState<IGameState>(IGameState.Auth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [inventoryState, setInventoryState] = useState<InventoryState | null>(
    null
  );

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocket(socket);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const openInventory = ()=>{
    btn_click_SFX.play()
    setIsInventoryOpen(true)
  }

  const closeInventory = ()=>{
    setIsInventoryOpen(false)
  }

  const closeErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <userContext.Provider
      value={{
        ...authState,
        authDispatch,
        socketID: socket?.id,
        gameState,
        setGameState,
        socket: socket,
        errorMessage,
        closeErrorMessage,
        loading,
        setLoading,
        setErrorMessage,
        isInventoryOpen,
        closeInventory,
        openInventory,
        inventoryState,
        setInventoryState,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
