import "./shop.css";
import { TransitionFrom} from "../../context/transitionContext";
import Coins from "../UI/Coins";
import {RiShoppingCart2Fill} from "react-icons/ri";
import Item from "./Item";
import BackBtn from "../UI/BackBtn";

const Shop = () => {

  return (
    <div className="shop-container">
      <Coins style={{right: "15px"}}/>
        <div className="shop-content">
          <BackBtn transition={TransitionFrom.shop}/>
          <h2 className="shop-title"><RiShoppingCart2Fill/> Shop</h2>
          <div className="items-container">
            <h3 className="title">Items</h3>
            <div className="items-wrapper">
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
            </div>
          </div>
          <div className="skins-container">
            <h3 className="title">Skins</h3>
            <div className="items-wrapper">
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
            </div>
          </div>
        </div>
    </div>
  );
};

export default Shop;
