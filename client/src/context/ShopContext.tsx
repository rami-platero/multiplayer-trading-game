import { createContext, useState, useContext } from "react";
import { ContextProps, Item } from "../interfaces/interfaces";
import { userContext } from "./UserContext";

interface IShopContext {
  shopItems: Item[] | null;
  buyItem: (item: Item) => void;
}

export const shopContext = createContext<IShopContext>({
  shopItems: null,
  buyItem: () => {},
});

export const ShopContextProvider = ({ children }: ContextProps) => {
  const { socket, authDispatch, user } = useContext(userContext);
  const [shopItems, setShopItems] = useState<Item[] | null>(null);

  const buyItem = (item: Item) => {
    if (item.price! <= user?.coins!) {
      authDispatch({ type: "BUY_ITEM", payload: item });
      authDispatch({
        type: "UPDATE_COINS",
        payload: user?.coins! - item.price!,
      });
    } else {
      console.log("you have not enough coins to buy this item");
    }
  };
  socket
    ?.off("SERVER:SEND-SHOP-ITEMS")
    .on("SERVER:SEND-SHOP-ITEMS", (shopItems) => {
      setShopItems(shopItems);
    });

  return (
    <shopContext.Provider
      value={{
        shopItems,
        buyItem,
      }}
    >
      {children}
    </shopContext.Provider>
  );
};
