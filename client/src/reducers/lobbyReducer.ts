import { IOffer, IUserinLobby, Lobby } from "../interfaces/interfaces";

export const LobbyInitialState = {
  lobby: null,
  lobbyUsers: [],
  offers: []
};

interface LobbyModel extends Lobby {
  users: IUserinLobby[];
  offers: IOffer[]
}

interface IState {
  lobby: Lobby | null;
  lobbyUsers: IUserinLobby[] | null;
  offers: IOffer[] | null
}

export type LobbyActionType =
  | {
      type: "JOIN";
      payload: LobbyModel;
    }
  | { type: "LEAVE" }
  | { type: "USER:JOINS"; payload: IUserinLobby[] }
  | {
      type: "USER:LEAVES";
      payload: string;
    };

export const lobbyReducer = (
  state: IState,
  action: LobbyActionType
): IState => {
  switch (action.type) {
    case "JOIN":
      const { users, offers, ...rest } = action.payload;
      return { lobby: rest, lobbyUsers: users, offers };
    case "LEAVE":
      return { lobbyUsers: null, lobby: null, offers: null };
    case "USER:JOINS":
      return { ...state, lobbyUsers: action.payload };
    case "USER:LEAVES":
      const filtered = state.lobbyUsers?.filter((user) => {
        return user._id !== action.payload;
      });
      return { ...state, lobbyUsers: filtered! };
    default:
      return state;
  }
};
