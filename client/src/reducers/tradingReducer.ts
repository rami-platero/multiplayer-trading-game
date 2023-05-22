import { IInventory } from "../interfaces/interfaces";

export const initalTradingItemsState = {
  items: [null, null, null, null, null, null],
  coins: 0
};

interface IState {
  items: (IInventory | null)[];
  coins: number
}

interface ISlotItem {
  item: IInventory;
  index: number;
}

export type TradingActionType =
  | { type: "ADD_ITEM"; payload: ISlotItem }
  | { type: "RESET" }
  | { type: "REMOVE_ITEM"; payload: number} | {type: "ADD_AMOUNT_ITEM", payload: number} | {type: "UPDATE_COINS", payload:number}

export const tradingReducer = (state: IState, action: TradingActionType): IState => {
  switch (action.type) {
    case "ADD_ITEM":
      const newItems: (IInventory | null)[] = [...state.items];
      newItems.splice(action.payload.index, 1, action.payload.item);
      return { ...state, items: [...newItems] };
    case "RESET":
      return initalTradingItemsState;
    case "REMOVE_ITEM":
      const itemsRemove: (IInventory | null)[] = [...state.items];
      itemsRemove.splice(action.payload, 1, null);
      return { ...state, items: [...itemsRemove] };
    case "ADD_AMOUNT_ITEM":
      const itemsWithUpdatedAmount: (IInventory | null)[] = state.items.map((item,index)=>{
        return index==action.payload && item!==null? {...item, count: item?.count+1} : item
      })
      return {...state, items: [...itemsWithUpdatedAmount]}
    case "UPDATE_COINS":
      return {...state, coins: action.payload}
    default:
      return state;
  }
};
