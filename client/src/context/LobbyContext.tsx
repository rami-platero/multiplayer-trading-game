import { createContext, useReducer } from "react";
import {
  ContextProps,
  IOffer,
  IUserinLobby,
  Lobby,
} from "../interfaces/interfaces";
import {
  LobbyActionType,
  LobbyInitialState,
  lobbyReducer,
} from "../reducers/lobbyReducer";

interface ILobbyContext {
  lobby: Lobby | null;
  lobbyDispatch: React.Dispatch<LobbyActionType>;
  lobbyUsers: IUserinLobby[] | null;
  offers: IOffer[] | null
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
  lobbyUsers: [],
  offers: []
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
