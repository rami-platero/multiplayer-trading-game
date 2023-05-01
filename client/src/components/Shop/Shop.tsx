import { useContext } from "react";
import useScaleContainer from "../../hooks/useScaleContainer";
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
  const containerRef = useScaleContainer(1408);
  const { setGameState } = useContext(userContext);
  const { setFromShop } = useContext(transitionContext);

  return (
    <div className="shop-container">
      <div className="shop-wrapper" ref={containerRef}>
        <div className="shop-content">
          <Coins style={{right: "0"}}/>
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
            </div>
          </div>
          <div className="skins-container">
            <h3 className="title">Skins</h3>
            <div className="skins-wrapper">
              <Skin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
