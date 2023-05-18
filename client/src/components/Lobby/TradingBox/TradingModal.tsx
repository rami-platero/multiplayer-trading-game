import { lobbyContext } from "../../../context/LobbyContext";
import "./tradingModal.css";
import { useContext } from "react";
import { AiOutlineUnlock } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiCoinLine } from "react-icons/ri";
import { InventoryState, userContext } from "../../../context/UserContext";
import Inventory from "../../Inventory/Inventory";
import { CSSTransition } from "react-transition-group";
import { tradingContext } from "../../../context/TradingContext";
import Slot from "./Slot";

const TradingModal = () => {
  const { currentTradeOffer } = useContext(lobbyContext);
  const { isInventoryOpen, inventoryState } = useContext(userContext);
  const {closeTrade} = useContext(tradingContext)
  const { items } = useContext(tradingContext);
  return (
    <div className="trading-modal">
      <div className="user-offer">
        <h2>{currentTradeOffer?.createdBy.username}'s Offer</h2>
        <img
          src={`../src/assets/items/${currentTradeOffer?.itemOffering.image}`}
          className={`item ${currentTradeOffer?.itemOffering?.type}`}
        />
      </div>
      <hr />
      <div className="your-offer">
        <h2>Your Offer</h2>
        <div className="trading-items">
          {items.map((item,index) => {
            return <Slot item={item} index={index} />;
          })}
        </div>
        <div className="coins-slot">
          <h3>Coins</h3>
          <div className="input-box">
            <RiCoinLine />
            <input type="number" placeholder="0" />
          </div>
          <button>
            <AiOutlineUnlock />
            Lock Coins
          </button>
        </div>
      </div>
      <div className="actions-buttons">
        <button onClick={closeTrade} className="close-offer-btn">
          <AiOutlineCloseCircle />
          Close Offer
        </button>
        <button className="lock-offer-btn">
          <AiOutlineUnlock />
          Lock offer
        </button>
      </div>
      <CSSTransition
        in={
          isInventoryOpen === true && inventoryState === InventoryState.Trading
        }
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <Inventory />
      </CSSTransition>
    </div>
  );
};

export default TradingModal;
