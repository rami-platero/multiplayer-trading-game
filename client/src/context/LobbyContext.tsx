import { createContext, useReducer, useState,SetStateAction } from "react";
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
  loading: boolean,
  setLoading: React.Dispatch<SetStateAction<boolean>>
}

export const lobbyContext = createContext<ILobbyContext>({
  lobby: null,
  lobbyDispatch: (): void => {},
  lobbyUsers: [],
  offers: [],
  loading: false,
  setLoading: () =>{}
});

const LobbyContextProvider = ({ children }: ContextProps) => {
  const [lobbyState, lobbyDispatch] = useReducer(
    lobbyReducer,
    LobbyInitialState
  );
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <lobbyContext.Provider value={{ ...lobbyState, lobbyDispatch, loading, setLoading }}>
      {children}
    </lobbyContext.Provider>
  );
};

export default LobbyContextProvider;
