import { lobbyContext } from "../../context/LobbyContext";
import { tradingContext } from "../../context/TradingContext";
import { InventoryState, userContext } from "../../context/UserContext";
import { IInventory } from "../../interfaces/interfaces";
import './items_styles.css'
import {useContext} from 'react'

interface Props {
  item: IInventory;
}

const Inv_Item = ({ item }: Props) => {

  const {makeOffer,currentTradeOffer}= useContext(lobbyContext)
  const {inventoryState,closeInventory,socket} = useContext(userContext)
  const {tradingDispatch,items,setCurrentIndexItem,currentIndexItem} = useContext(tradingContext)

  const addItem = (item: IInventory) => {
    const result = items.some((it) => {
      return it?.itemId.name == item.itemId.name;
    });
    if (!result && item.itemId._id !== currentTradeOffer?.itemOffering._id) {
      closeInventory();
      tradingDispatch({
        type: "ADD_ITEM",
        payload: { item: { ...item, count: 1 }, index: currentIndexItem! },
      });
      socket?.emit("TRADER:ADD-ITEM", {
        item: item.itemId,
        socketID: currentTradeOffer?.createdBy.socketID,
        index: currentIndexItem,
      });
      setCurrentIndexItem(null);
    }
  };

  const handleItem = ()=>{
    if(inventoryState==InventoryState.Offer){
      makeOffer(item.itemId)
    }
    if(inventoryState===InventoryState.Trading){
      addItem(item)
    }
  }


  return (
    <>
    <div onClick={handleItem} key={item.itemId._id} className={`item ${item.itemId.type}`}>
      {item.count > 1 && <p className="item-count">{item.count}</p>}
      <img src={`../src/assets/items/${item.itemId.image}`} />
    </div>
    </>
  );
};

export default Inv_Item;
