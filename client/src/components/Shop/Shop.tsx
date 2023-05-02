import { useContext } from "react";
import "./shop.css";
import { userContext } from "../../context/UserContext";
import { IGameState } from "../../interfaces/interfaces";
import { transitionContext } from "../../context/transitionContext";
import { BsArrowLeftShort } from "react-icons/bs";
import Coins from "../UI/Coins";
import {RiShoppingCart2Fill} from "react-icons/ri";
import Item from "./Item";
import Skin from "./Skin";

const Shop = () => {
  const { setGameState } = useContext(userContext);
  const { setFromShop } = useContext(transitionContext);

  return (
    <div className="shop-container">
      <Coins style={{right: "15px"}}/>
        <div className="shop-content">
          <button
            onClick={async () => {
              setFromShop(true);
              setGameState(IGameState.Main);
              setTimeout(() => {
                setFromShop((prevState) => !prevState);
              }, 400);
            }}
          >
            <BsArrowLeftShort /> Back to Menu
          </button>
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
