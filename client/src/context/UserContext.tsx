import { createContext, useEffect, useReducer, useState } from "react";
import { IUser } from "../interfaces/interfaces";
import { authReducer, initialState, ActionType } from "../reducers/authReducer";
import io, { Socket } from "socket.io-client";
import { IGameState } from "../interfaces/interfaces";
import { contextProps } from "../interfaces/interfaces";


interface IAuthContext {
  user: IUser | null;
  authDispatch: React.Dispatch<ActionType>;
  socketID: string | undefined;
  gameState: IGameState;
  setGameState: React.Dispatch<React.SetStateAction<IGameState>>
}

export const userContext = createContext<IAuthContext>({
  user: null,
  authDispatch: ():void => {},
  socketID: undefined,
  gameState: IGameState.Auth,
  setGameState: () => {}
});

export const UserContextProvider = ({ children }: contextProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const [gameState, setGameState] = useState<IGameState>(IGameState.Auth);

  /* useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocket(socket);
      console.log(socket.id)
    });

    return () => {
      socket.disconnect();
    };
  }, []); */

  return (
    <userContext.Provider
      value={{ ...authState, authDispatch, socketID: socket?.id, gameState, setGameState }}
    >
      {children}
    </userContext.Provider>
  );
};
