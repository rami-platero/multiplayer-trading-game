import { UserItem } from "../../interfaces/interfaces";
import './items_styles.css'
import {useEffect} from 'react'

interface Props {
  item: UserItem;
}

const Inv_Item = ({ item }: Props) => {

  useEffect(()=>{
    console.log(item.itemId.image)
  },[])

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
