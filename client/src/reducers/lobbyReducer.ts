import { Lobby } from "../interfaces/interfaces";

export const LobbyInitialState = {
  lobby: null,
};

interface IState {
  lobby: Lobby | null;
}

export type LobbyActionType =
  | {
      type: "JOIN";
      payload: Lobby;
    }
  | { type: "LEAVE" };

export const lobbyReducer = (state: IState, action: LobbyActionType) => {
  switch (action.type) {
    case "JOIN":
      return { lobby: action.payload };
    case "LEAVE":
      return { lobby: null };
    default:
      return state;
  }
};