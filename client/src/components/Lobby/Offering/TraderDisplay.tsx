import { tradingContext } from "../../../context/TradingContext";
import { useContext } from "react";
import "./traderDisplay.css";
import { userContext } from "../../../context/UserContext";
import { lock_SFX, place_item_SFX } from "../../SFX";
import { RiCoinLine } from "react-icons/ri";
import { AiOutlineUnlock } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";


const TraderDisplay = () => {
  const {
    tradingWith,
    items,
    tradingDispatch,
    tradeFlags,
    unlockOffer,
    setTradeFlags,
    coins,
    rejectUser,
    acceptTrade
  } = useContext(tradingContext);
  const { socket } = useContext(userContext);

  socket?.off("TRADE:REMOVE-ITEM").on("TRADE:REMOVE-ITEM", (index) => {
    tradingDispatch({ type: "REMOVE_ITEM", payload: index });
  });

  socket?.off("TRADE:ADD_ITEM_AMOUNT").on("TRADE:ADD_ITEM_AMOUNT", (index) => {
    tradingDispatch({ type: "ADD_AMOUNT_ITEM", payload: index });
  });

  socket?.off("TRADE:ADD-ITEM").on("TRADE:ADD-ITEM", (obj) => {
    place_item_SFX.play();
    tradingDispatch({ type: "ADD_ITEM", payload: obj });
  });

  socket?.off("TRADE:LOCKED").on("TRADE:LOCKED", () => {
    setTradeFlags((prevFlags)=>({
      ...prevFlags,isTradeLocked: true
    }))
    lock_SFX.play()
  });

  socket?.off("TRADE:UPDATE_COINS").on("TRADE:UPDATE_COINS", coins=>{
    tradingDispatch({type:"UPDATE_COINS", payload: coins})
  })

  const handleAccept = ()=>{
    acceptTrade()
  }

  return (
    <div className="trading-display">
      <h3>Trading with {tradingWith?.username}</h3>
      <div className="coins-slot">
        <h3>Coins</h3>
        <div className="input-box">
          <RiCoinLine />
          <input type="number" placeholder="0" disabled value={coins}/>
        </div>
      </div>
      <div className="trading-items-slots">
        {items.map((item) => {
          return (
            <div className={`item-slot item ${item?.itemId.type}`}>
              {item !== null && (
                <img src={item.itemId.image} />
              )}
              {item !== null && item.count > 1 && <p>{item?.count}</p>}
            </div>
          );
        })}
      </div>
      <div className="actions-buttons">
        <button
          className="accept-trade-btn"
          disabled={tradeFlags.isTradeLocked ? false : true}
          onClick={()=>handleAccept()}
        >
          <AiFillCheckCircle/>
          Accept
        </button>
        <button
          className="unlock-trade-btn"
          disabled={tradeFlags.isTradeLocked ? false : true}
          onClick={unlockOffer}
        >
          <AiOutlineUnlock />
          Unlock
        </button>
        <button className="reject-trade-btn" onClick={rejectUser}>
          <AiFillCloseCircle />
          Reject
        </button>
      </div>
    </div>
  );
};

export default TraderDisplay;
