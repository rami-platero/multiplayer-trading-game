import { userContext } from "../../context/UserContext";
import { useContext, useState} from "react";
import "./tradeModal.css";
import { tradingContext } from "../../context/TradingContext";
import { deal_SFX } from "../SFX";

const TradeModal = () => {
  const { socket } = useContext(userContext);
  const [tradeStatus, setTradeStatus] = useState<string>("Verifying users");
  const [progressState, setProgressState] = useState<number>(0)
  const {setTradeModal} = useContext(tradingContext)

  const style = {
    '--progressWidth': `${progressState}%`
  } as React.CSSProperties;

  const resetTradeModal = ()=>{
    setTradeModal(false)
    setTimeout(()=>{
      setTradeStatus("Verifying users")
      setProgressState(0)
    },300)
  }

  socket?.off("TRADE:STATUS").on("TRADE:STATUS", (msg) => {
    setTradeStatus(msg);
  });

  socket?.off("TRADE:PROGRESS").on("TRADE:PROGRESS", (num:number) => {
    setProgressState(num)
    if(num===100){
      resetTradeModal()
      deal_SFX.play()
    }
  })

  return (
    <div className="trade-modal">
      <h1>Trade Status</h1>
      <div className="progress-bar" style={style}>
        <h3>{tradeStatus}</h3>
      </div>
      <p>Please wait, the transaction is in progress...</p>
    </div>
  );
};

export default TradeModal;
