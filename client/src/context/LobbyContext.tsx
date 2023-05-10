import { createContext, useContext, useState, useReducer } from "react";
import {
  ContextProps,
  IOffer,
  IUser,
  Lobby,
  LobbyType,
} from "../interfaces/interfaces";
import {
  LobbyActionType,
  LobbyInitialState,
  lobbyReducer,
} from "../reducers/lobbyReducer";

interface ILobbyContext {
  lobby: Lobby | null;
  lobbyDispatch: React.Dispatch<LobbyActionType>;
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
});

const LobbyContextProvider = ({ children }: ContextProps) => {
  const [lobbyState, lobbyDispatch] = useReducer(
    lobbyReducer,
    LobbyInitialState
  );

  return (
    <lobbyContext.Provider value={{ ...lobbyState, lobbyDispatch }}>
      {children}
    </lobbyContext.Provider>
  );
};

export default LobbyContextProvider;
