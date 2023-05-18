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

  const {makeOffer}= useContext(lobbyContext)
  const {inventoryState} = useContext(userContext)
  const {addItem} = useContext(tradingContext)

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
