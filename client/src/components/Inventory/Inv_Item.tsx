import { lobbyContext } from "../../context/LobbyContext";
import { tradingContext } from "../../context/TradingContext";
import { InventoryState, userContext } from "../../context/UserContext";
import { IInventory } from "../../interfaces/interfaces";
import './items_styles.css'
import {useContext} from 'react'
import {GrFormClose} from 'react-icons/gr'

interface Props {
  item: IInventory;
  isRemoving?: boolean
}

const Inv_Item = ({ item, isRemoving }: Props) => {

  const {makeOffer,currentTradeOffer}= useContext(lobbyContext)
  const {inventoryState,closeInventory,socket,removeItem} = useContext(userContext)
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
        offerID: currentTradeOffer?._id
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
    <div onClick={handleItem} key={item.itemId._id} className={`item ${item.itemId.type} ${isRemoving}`}>
      {item.count > 1 && <p className="item-count">{item.count}</p>}
      <img src={`../src/assets/items/${item.itemId.image}`} />
      {isRemoving && inventoryState===InventoryState.Menu &&
      <GrFormClose onClick={()=>{
        removeItem(item.itemId)
      }}/>
      }
    </div>
    </>
  );
};

export default Inv_Item;
