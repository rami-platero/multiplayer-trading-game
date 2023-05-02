import "./item.css";
import ItemIMG from "../../assets/items/Dark-Skin.png";
import { RiCoinLine } from "react-icons/ri";

const Item = () => {
  return (
    <div className="item-wrapper">
      <div>
        <img src={ItemIMG} />
      </div>
      <div className="col-1">
        <h3>Dark Skin</h3>
        <h3 className="item-value">
          <RiCoinLine /> 5000
        </h3>
      </div>
      <button>Buy</button>
    </div>
  );
};

export default Item;
