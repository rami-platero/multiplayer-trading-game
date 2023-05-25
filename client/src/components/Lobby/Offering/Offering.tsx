import { lobbyContext } from "../../../context/LobbyContext";
import { OfferingState, tradeFlagsInitialState, tradingContext } from "../../../context/TradingContext";
import { userContext } from "../../../context/UserContext";
import { IUser } from "../../../interfaces/interfaces";
import TraderDisplay from "./TraderDisplay";
import "./offering.css";
import { useContext,SetStateAction } from "react";

interface Props{
  setAcceptTrade: React.Dispatch<SetStateAction<boolean>>
}

const Offering = ({setAcceptTrade}:Props) => {
  const { itemOffering, closeOffer } = useContext(lobbyContext);
  const { offeringState, setTradingWith,setOfferingState,tradingDispatch,setTradeFlags } = useContext(tradingContext);
  const {socket} = useContext(userContext)

  socket?.off("new-trader").on("new-trader", (trader:IUser)=>{
    setTradingWith(trader);
    setOfferingState(OfferingState.Trading);
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
          src={`'../../src/assets/items/${itemOffering?.image}`}
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
      {offeringState === OfferingState.Trading && <TraderDisplay setAcceptTrade={setAcceptTrade}/>}
    </div>
  );
};

export default Offering;
