import { tradingContext } from "../../../context/TradingContext";
import { useContext } from "react";
import "./traderDisplay.css";

const TraderDisplay = () => {
  const { tradingWith, items } = useContext(tradingContext);
  return (
    <div className="trading-display">
      <h3>Trading with {tradingWith?.username}</h3>
      <div className="trading-items-slots">
        {items.map((item) => {
          return (
            <div className={`item-slot item ${item?.itemId.type}`}>
              {item !== null && (
                <img src={`../../src/assets/items/${item.itemId.image}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="actions-buttons">
        <button className="accept-trade-btn">Accept</button>
        <button className="unlock-trade-btn">Unlock</button>
        <button className="Reject-trade-btn">Reject</button>
      </div>
    </div>
  );
};

export default TraderDisplay;
