import { IUser } from "../interfaces/interfaces";

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
  | { type: "LOG_OUT" };

export const authReducer = (state: IState, action: ActionType) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOG_OUT":
      return { user: null };
    default:
      return state;
  }
};
