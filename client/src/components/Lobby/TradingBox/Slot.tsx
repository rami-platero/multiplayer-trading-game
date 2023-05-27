import { userContext } from "../../../context/UserContext";
import { IInventory } from "../../../interfaces/interfaces";
import { GrAdd} from "react-icons/gr";
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
  const {setCurrentIndexItem,removeItem,addItemAmount,tradeFlags} = useContext(tradingContext)

  const handleSlot = ()=>{
    if(item==null){
        setCurrentIndexItem(index)
        openInventory()
    }
  }

  return (
    <button className={`add-item ${item !== null && "disabled"}`} onClick={handleSlot} disabled={tradeFlags.isTradeLocked? true: false}>
      {item === null? <GrAdd />: <img className={`item ${item.itemId.type}`} src={item.itemId.image}/>}
      {item!==null && <GrAdd onClick={()=>{
        addItemAmount(item,index)
      }}/>}
      {item!==null && <GrFormClose onClick={()=>{removeItem(index)}}/>}
      {item?.count!>1 && <p>{item?.count}</p>}
    </button>
  );
};

export default Slot;
