import { userContext } from "../../context/UserContext";
import { useContext, useState,useRef } from "react";
import "./tradeModal.css";

const TradeModal = () => {
  const { socket } = useContext(userContext);
  const [tradeStatus, setTradeStatus] = useState<string>("Verifying users");

  const progressRef = useRef<number>(0)

  const style = {
    '--progressWidth': `${progressRef.current}%`
  } as React.CSSProperties;

  socket?.off("TRADE:STATUS").on("TRADE:STATUS", (msg) => {
    setTradeStatus(msg);
  });

  socket?.off("TRADE:PROGRESS").on("TRADE:PROGRESS", (num:number) => {
    console.log(num,"%")
    progressRef.current = num
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
