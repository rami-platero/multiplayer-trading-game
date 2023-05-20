import { tradingContext } from "../../../context/TradingContext";
import { useContext } from "react";
import "./traderDisplay.css";
import { userContext } from "../../../context/UserContext";
import { place_item_SFX } from "../../SFX";

const TraderDisplay = () => {
  const { tradingWith, items,tradingDispatch } = useContext(tradingContext);
  const {socket} = useContext(userContext)

  socket?.off("TRADE:REMOVE-ITEM").on("TRADE:REMOVE-ITEM", (index) => {
    tradingDispatch({ type: "REMOVE_ITEM", payload: index });
  });

  socket?.off("TRADE:ADD_ITEM_AMOUNT").on("TRADE:ADD_ITEM_AMOUNT", (index) => {
    console.log("index is", index)
    tradingDispatch({ type: "ADD_AMOUNT_ITEM", payload: index });
  });

  socket?.off("TRADE:ADD-ITEM").on("TRADE:ADD-ITEM", (obj) => {
    place_item_SFX.play();
    tradingDispatch({ type: "ADD_ITEM", payload: obj });
  });

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
              {item!== null && item.count>1 && <p>{item?.count}</p>}
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
