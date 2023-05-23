import { IInventory, ISkin, IUser } from "../interfaces/interfaces";

export const initialState = {
  user: null,
};

interface IState {
  user: IUser | null;
}

export type ActionType =
  | {
      type: "LOGIN";
      payload: IUser;
    }
  | { type: "LOG_OUT" }
  | { type: "CHANGE_SKIN"; payload: string }
  | { type: "UPDATE_INVENTORY"; payload: IInventory[] };

export const authReducer = (state: IState, action: ActionType) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOG_OUT":
      return { user: null };
    case "CHANGE_SKIN":
      const newUser: IState = {
        ...state,
        user: {
          ...(state.user as IUser),
          skin: {
            chatColor: action.payload!,
            badgeColor: action.payload!,
          },
        },
      };
      return newUser;
    case "UPDATE_INVENTORY":
      return {
        ...state,
        user: { ...(state.user as IUser), items: action.payload },
      };
    default:
      return state;
  }
};
