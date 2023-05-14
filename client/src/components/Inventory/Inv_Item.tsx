import { InventoryState, lobbyContext } from "../../context/LobbyContext";
import { IInventory } from "../../interfaces/interfaces";
import './items_styles.css'
import {useContext} from 'react'

interface Props {
  item: IInventory;
}

const Inv_Item = ({ item }: Props) => {

  const {makeOffer,inventoryState}= useContext(lobbyContext)

  const handleItem = ()=>{
    if(inventoryState==InventoryState.Offer){
      makeOffer(item.itemId)
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
