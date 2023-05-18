import { IInventory } from "../interfaces/interfaces";

export const initalTradingItemsState = {
  items: [null, null, null, null, null, null],
};

interface IState {
  items: (IInventory | null)[];
}

interface ISlotItem {
  item: IInventory;
  index: number;
}

export type ActionType =
  | { type: "ADD_ITEM"; payload: ISlotItem }
  | { type: "RESET" };

export const tradingReducer = (state: IState, action: ActionType): IState => {
  switch (action.type) {
    case "ADD_ITEM":
      const newItems: (IInventory | null)[] = [...state.items];
      newItems.splice(action.payload.index, 1, action.payload.item);
      return { ...state, items: [...newItems] };
    case "RESET":
      return initalTradingItemsState;
    default:
      return state;
  }
};
