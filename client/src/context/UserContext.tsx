import { createContext, useEffect, useReducer, useState,SetStateAction } from "react";
import { IUser } from "../interfaces/interfaces";
import { authReducer, initialState, ActionType } from "../reducers/authReducer";
import io, { Socket } from "socket.io-client";
import { IGameState } from "../interfaces/interfaces";
import { ContextProps } from "../interfaces/interfaces";

interface IAuthContext {
  user: IUser | null;
  authDispatch: React.Dispatch<ActionType>;
  socketID: string | undefined;
  gameState: IGameState;
  setGameState: React.Dispatch<React.SetStateAction<IGameState>>;
  socket: Socket | null;
  errorMessage: string | null;
  closeErrorMessage: ()=> void
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;

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
  closeErrorMessage: ()=>{},
  loading: false,
  setLoading: () => {}
});

export const UserContextProvider = ({ children }: ContextProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const [gameState, setGameState] = useState<IGameState>(IGameState.Auth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocket(socket);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const closeErrorMessage = () =>{
    setErrorMessage(null)
  }

  (function handleSocketUserEvents() {
    socket?.off("error").on("error", ({ message, type }) => {
      switch (type) {
        case ErrorType.DuplicateLogin:
          setErrorMessage(message)
          authDispatch({ type: "LOG_OUT" });
          setGameState(IGameState.Auth);
          break;

        default:
          break;
      }
    });
  })();

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
        setLoading
      }}
    >
      {children}
    </userContext.Provider>
  );
};
