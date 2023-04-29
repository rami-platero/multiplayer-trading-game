import { createContext, useEffect, useReducer, useState } from "react";
import { IUser } from "../interfaces/interfaces";
import { authReducer, initialState, ActionType } from "../reducers/authReducer";
import io, { Socket } from "socket.io-client";

interface props {
  children: JSX.Element | JSX.Element[];
}

interface IAuthContext {
  user: IUser | null;
  authDispatch: React.Dispatch<ActionType>;
  socketID: string | undefined;
}

export const userContext = createContext<IAuthContext>({
  user: null,
  authDispatch: () => {},
  socketID: undefined,
});

export const UserContextProvider = ({ children }: props) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [authState, authDispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocket(socket);
      console.log(socket.id)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <userContext.Provider
      value={{ ...authState, authDispatch, socketID: socket?.id }}
    >
      {children}
    </userContext.Provider>
  );
};
