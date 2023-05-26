import { IInventory, IUser, Item } from "../interfaces/interfaces";

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
  | { type: "UPDATE_INVENTORY"; payload: IInventory[] }
  | { type: "UPDATE_COINS"; payload: number }
  | { type: "BUY_ITEM"; payload: Item }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_COUNT_ITEM"; payload: string };

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
    case "UPDATE_COINS":
      return {
        ...state,
        user: { ...(state.user as IUser), coins: action.payload },
      };
    case "BUY_ITEM":
      const foundItem = state.user?.items.find((item) => {
        return item.itemId._id === action.payload._id;
      });
      if (foundItem) {
        const newItems = (state.user?.items as IInventory[]).map((item) => {
          if (item.itemId._id === action.payload._id) {
            return { ...item, count: item.count + 1 };
          } else {
            return item;
          }
        });
        return {
          ...state,
          user: { ...(state.user as IUser), items: [...newItems] },
        };
      } else {
        return {
          ...state,
          user: {
            ...(state.user as IUser),
            items: [
              ...(state.user?.items as IInventory[]),
              { itemId: action.payload, count: 1 },
            ],
          },
        };
      }
    case "REMOVE_ITEM":
      const updatedItems = (state.user?.items as IInventory[]).filter(
        (item) => {
          if (item.itemId._id !== action.payload) {
            return item;
          }
        }
      );
      return {
        ...state,
        user: { ...(state.user as IUser), items: updatedItems },
      };
    case "UPDATE_COUNT_ITEM":
      const updatedCountItems = (state.user?.items as IInventory[]).map(
        (item) => {
          if (item.itemId?._id === action.payload) {
            return {...item, count: item.count-1};
          } else {
            return item;
          }
        }
      );
      return {
        ...state,
        user: { ...(state.user as IUser), items: updatedCountItems },
      };
    default:
      return state;
  }
};
