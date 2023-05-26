import "./shop.css";
import { TransitionFrom } from "../../context/transitionContext";
import Coins from "../UI/Coins";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { ShopItem } from "./Item";
import BackBtn from "../UI/BackBtn";
import { useContext } from "react";
import { shopContext } from "../../context/ShopContext";
import { CSSTransition } from "react-transition-group";
import PurchaseModal from "../UI/PurchaseModal";

const Shop = () => {
  const { shopItems, purchaseModal } = useContext(shopContext);

  return (
    <div className="shop-container">
      <Coins style={{ right: "15px" }} />
      <CSSTransition
        in={purchaseModal.state === true}
        timeout={300}
        unmountOnExit
        classNames={"grow"}
        key={"grow"}
      >
        <PurchaseModal />
      </CSSTransition>
      <div className="shop-content">
        <BackBtn transition={TransitionFrom.shop} />
        <h2 className="shop-title">
          <RiShoppingCart2Fill /> Shop
        </h2>
        <div className="items-container">
          <h3 className="title">Items</h3>
          <div className="items-wrapper">
            {shopItems?.map((item) => {
              if (!item.isSkin) {
                return <ShopItem key={item._id} item={item} />;
              }
            })}
          </div>
        </div>
        <div className="skins-container">
          <h3 className="title">Skins</h3>
          <div className="items-wrapper">
            {shopItems?.map((item) => {
              if (item.isSkin) {
                return <ShopItem key={item._id} item={item} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
