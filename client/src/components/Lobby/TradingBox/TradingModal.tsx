import { lobbyContext } from "../../../context/LobbyContext";
import "./tradingModal.css";
import { useContext,useState,useRef } from "react";
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
  const { isInventoryOpen, inventoryState, socket,user } = useContext(userContext);
  const { closeTrade, lockOffer, items, tradeFlags,setTradeFlags,lockCoins } =
    useContext(tradingContext);
  const [coins, setCoins] = useState<string>('')
  const [currentCoins, setCurrentCoins] = useState<string>("")
  let shouldReset = true
  const isLocked = useRef(false);

  socket?.off("TRADE:UNLOCKED").on("TRADE:UNLOCKED", () => {
    setTradeFlags((prevFlags)=>({
      ...prevFlags,isTradeLocked: false
    }))
  });

  const handleCoinsChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(tradeFlags.coinsLocked){
      setTradeFlags((prevFlags)=>({
        ...prevFlags,coinsLocked: false
      }))
    }
    if (e.target.value === '') {
      setCoins('');
    } else if (parseInt(e.target.value) <= (user?.coins ?? 0)) {
      setCoins(e.target.value);
    }
  }

  const handleFocusCoins = ()=>{
    setCurrentCoins(coins)
  }

  const handleBlurCoins = ()=>{
    setTimeout(()=>{
      if(isLocked.current){
        console.log("it was locked before")
        if(currentCoins===coins){
          setTradeFlags((prevFlags)=>({
            ...prevFlags,coinsLocked: true
          }))
        } else {
          setTimeout(()=>{
            if(shouldReset){
              setTradeFlags((prevFlags)=>({
                ...prevFlags,coinsLocked: true
              }))
              setCoins(currentCoins)
            }
          },200)
        }
      }
    },1)
  }

  const handleLockCoins = ()=>{
    shouldReset=false
    isLocked.current=true
    if(!coins.trim()){
      lockCoins(0)
    } else {
      lockCoins(parseInt(coins))
    }
  }

  const handleCloseOffer = ()=>{
    socket?.emit("USER:CLOSE_TRADE", currentTradeOffer);
    closeTrade()
  }

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
          {items.map((item, index) => {
            return <Slot item={item} index={index} />;
          })}
        </div>
        <div className="coins-slot">
          <h3>Coins <span>(max: {user?.coins})</span></h3>
          <div className="input-box">
            <RiCoinLine />
            <input type="number" min={0} placeholder="0" onChange={handleCoinsChange} max={user?.coins} value={coins} onFocus={handleFocusCoins} onBlur={handleBlurCoins}/>
          </div>
          <button disabled={tradeFlags.coinsLocked? true: false} onClick={handleLockCoins}>
            {!tradeFlags.coinsLocked && 
            <>
            <AiOutlineUnlock />
            Lock Coins
            </>
            }
            {tradeFlags.coinsLocked && 
            <>
            <AiOutlineLock />
            Locked
            </>
            }
          </button>
        </div>
      </div>
      <div className="actions-buttons">
        <button onClick={()=>{
          handleCloseOffer()
        }} className="close-offer-btn">
          <AiOutlineCloseCircle />
          Close Offer
        </button>
        <button
          className={`lock-offer-btn ${tradeFlags.isTradeLocked}`}
          onClick={lockOffer}
        >
          {!tradeFlags.isTradeLocked&& (
            <>
              <AiOutlineUnlock />
              Lock offer
            </>
          )}
          {tradeFlags.isTradeLocked && (
            <>
              <AiOutlineLock />
              Locked
            </>
          )}
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
