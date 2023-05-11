import { IInventory } from "../../interfaces/interfaces";
import './items_styles.css'
import {useEffect} from 'react'

interface Props {
  item: IInventory;
}

const Inv_Item = ({ item }: Props) => {

  return (
    <>
    <div key={item.itemId._id} className={`item ${item.itemId.type}`}>
      {item.count > 1 && <p className="item-count">{item.count}</p>}
      <img src={`../src/assets/items/${item.itemId.image}`} />
    </div>
    </>
    
  );
};

export default Inv_Item;
