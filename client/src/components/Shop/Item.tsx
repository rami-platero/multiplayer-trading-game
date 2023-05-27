import "./item.css";
import { RiCoinLine } from "react-icons/ri";
import { Item } from "../../interfaces/interfaces";
import { useContext } from "react";
import { shopContext } from "../../context/ShopContext";

interface Props{
  item: Item
}

export const ShopItem = ({item}:Props) => {
  const {buyItem} = useContext(shopContext)
  return (
    <div className="item-wrapper">
      <div>
        <img src={item.image} />
      </div>
      <div className="col-1">
        <h3>{item.name}</h3>
        <h3 className="item-value">
          <RiCoinLine /> {item.price}
        </h3>
      </div>
      <button onClick={()=>{
        buyItem(item)
      }}>Buy</button>
    </div>
  );
};

