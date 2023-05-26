import { createContext, useState, useContext } from "react";
import { ContextProps, Item } from "../interfaces/interfaces";
import { userContext } from "./UserContext";
import { POST_buyItem } from "../api/item";
import { success_SFX } from "../components/SFX";

const purchaseModalInitialState = {
  state: false,
  error: false,
  itemIMG: null,
  message: "",
};

interface IPurchaseModal {
  state: boolean;
  error: boolean;
  itemIMG: string | null;
  message: string;
}

interface IShopContext {
  shopItems: Item[] | null;
  buyItem: (item: Item) => void;
  closePurchaseModal: () => void;
  purchaseModal: IPurchaseModal;
}

export const shopContext = createContext<IShopContext>({
  shopItems: null,
  buyItem: () => {},
  closePurchaseModal: () => {},
  purchaseModal: purchaseModalInitialState,
});

export const ShopContextProvider = ({ children }: ContextProps) => {
  const { socket, authDispatch, user, setLoading } = useContext(userContext);
  const [shopItems, setShopItems] = useState<Item[] | null>(null);
  const [purchaseModal, setPurchaseModal] = useState<IPurchaseModal>(
    purchaseModalInitialState
  );

  const buyItem = async (item: Item) => {
    if (item.price! <= user?.coins!) {
      setLoading(true);
      try {
        const res = await POST_buyItem(user?._id!, item?._id!);
        authDispatch({ type: "BUY_ITEM", payload: res.data.boughtItem });
        authDispatch({
          type: "UPDATE_COINS",
          payload: res.data.newCoins,
        });
        setLoading(false);
        success_SFX.play()
        setPurchaseModal({
          itemIMG: item.image,
          error: false,
          state: true,
          message: `Congratulations! You bought ${item.name}`
        });
      } catch (error: any) {
        setLoading(false);
        setPurchaseModal({
          itemIMG: null,
          error: true,
          state: true,
          message: error.response.data.message,
        });
      }
    } else {
      setPurchaseModal({
        itemIMG: null,
        error: true,
        state: true,
        message: "You don't have enough coins to buy this item",
      });
    }
  };

  socket
    ?.off("SERVER:SEND-SHOP-ITEMS")
    .on("SERVER:SEND-SHOP-ITEMS", (shopItems) => {
      setShopItems(shopItems);
    });

  const closePurchaseModal = () => {
    setPurchaseModal((prev) => ({ ...prev, state: false }));
  };

  return (
    <shopContext.Provider
      value={{
        shopItems,
        buyItem,
        closePurchaseModal,
        purchaseModal,
      }}
    >
      {children}
    </shopContext.Provider>
  );
};
