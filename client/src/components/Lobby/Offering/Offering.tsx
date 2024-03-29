import { lobbyContext } from "../../../context/LobbyContext";
import { OfferingState, tradeFlagsInitialState, tradingContext } from "../../../context/TradingContext";
import { userContext } from "../../../context/UserContext";
import { IUser } from "../../../interfaces/interfaces";
import { new_trader_SFX } from "../../SFX";
import TraderDisplay from "./TraderDisplay";
import "./offering.css";
import { useContext } from "react";

const Offering = () => {
  const { itemOffering, closeOffer } = useContext(lobbyContext);
  const { offeringState, setTradingWith,setOfferingState,tradingDispatch,setTradeFlags } = useContext(tradingContext);
  const {socket} = useContext(userContext)

  socket?.off("new-trader").on("new-trader", (trader:IUser)=>{
    setTradingWith(trader);
    setOfferingState(OfferingState.Trading);
    new_trader_SFX.play()
  })

  socket?.off("trader-leaves").on("trader-leaves", () => {
    setTradeFlags(tradeFlagsInitialState)
    setOfferingState(OfferingState.Offering);
    setTradingWith(null);
    tradingDispatch({ type: "RESET" });
  });

  return (
    <div className="offering-container">
      <div className="item-offered">
        <h2>Your Offer</h2>
        <img
          src={itemOffering?.image}
          className={`item ${itemOffering?.type}`}
        />
      </div>
      {offeringState === OfferingState.Offering && (
        <>
          <div className="displayed-trader">
            <h1>Waiting for an interested trader</h1>
          </div>
          <div className="footer">
            <button onClick={closeOffer}>Close Offer</button>
          </div>
        </>
      )}
      {offeringState === OfferingState.Trading && <TraderDisplay/>}
    </div>
  );
};

export default Offering;
