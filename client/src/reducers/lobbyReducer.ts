import { IOffer, IUserinLobby, Lobby, Status } from "../interfaces/interfaces";

export const LobbyInitialState = {
  lobby: null,
  lobbyUsers: [],
  offers: [],
};

interface LobbyModel extends Lobby {
  users: IUserinLobby[];
  offers: IOffer[];
}

interface IState {
  lobby: Lobby | null;
  lobbyUsers: IUserinLobby[] | null;
  offers: IOffer[] | null;
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
    }
  | {
      type: "MAKE_OFFER";
      payload: IOffer[];
    }
  | {
      type: "REMOVE_OFFER";
      payload: string;
    }
  | {
      type: "LOCK_OFFER";
      payload: IOffer;
    }
  | {
      type: "UNLOCK_OFFER";
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
    case "MAKE_OFFER":
      return {
        ...state,
        offers: action.payload,
      };
    case "REMOVE_OFFER":
      const newOffers = state.offers?.filter((offer) => {
        return offer.itemOffering._id != action.payload;
      });
      return {
        ...state,
        offers: newOffers!,
      };
    case "LOCK_OFFER":
      const updateOffersOnLock = state.offers?.map((offer) => {
        if (offer._id === action.payload._id) {
          return action.payload;
        } else {
          return offer;
        }
      });
      return { ...state, offers: updateOffersOnLock! };
    case "UNLOCK_OFFER":
      const offersWithUnlocked = state.offers!.map((offer) => {
        if (offer._id === action.payload) {
          const {tradingWith, ...rest} = offer
          return { ...rest, status: Status.Open};
        } else {
          return offer;
        }
      });
      return { ...state, offers: offersWithUnlocked };
    default:
      return state;
  }
};
