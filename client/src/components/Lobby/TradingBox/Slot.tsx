import { userContext } from "../../../context/UserContext";
import { IInventory } from "../../../interfaces/interfaces";
import { GrAdd, GrClose } from "react-icons/gr";
import { useContext } from "react";
import { tradingContext } from "../../../context/TradingContext";
import './slot.css'
import {GrFormClose} from 'react-icons/gr'

interface Props {
  item: IInventory | null;
  index: number
}

const Slot = ({ item, index }: Props) => {
  const { openInventory } = useContext(userContext);
  const {setCurrentIndexItem} = useContext(tradingContext)

  const handleSlot = ()=>{
    if(item==null){
        setCurrentIndexItem(index)
        openInventory()
    }
  }

  const addItemAmount = ()=>{
    console.log("adding amount")
  }

  const removeItem = ()=>{
    
  }

  return (
    <button className={`add-item ${item !== null && "disabled"}`} onClick={handleSlot}>
      {item === null? <GrAdd />: <img className={`item ${item.itemId.type}`} src={`../../src/assets/items/${item.itemId.image}`}/>}
      {item?.count==1 && item!==null && <GrAdd onClick={addItemAmount}/>}
      {item?.count==1 && item!==null && <GrFormClose onClick={()=>{removeItem()}}/>}
    </button>
  );
};

export default Slot;
