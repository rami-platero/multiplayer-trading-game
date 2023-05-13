import { lobbyContext } from "../../../context/LobbyContext";
import "./offering.css";
import { useContext } from "react";

const Offering = () => {
  const { itemOffering,closeOffer } = useContext(lobbyContext);

  return (
    <div className="offering-container">
      <div className="item-offered">
        <h2>Your Offer</h2>
        <img
          src={`'../../src/assets/items/${itemOffering?.image}`}
          className={`item ${itemOffering?.type}`}
        />
      </div>
      <div className="displayed-trader">
        <h1>Waiting for an interested trader</h1>
      </div>
      <div className="footer">
        <button onClick={closeOffer}>Close Offer</button>
      </div>
    </div>
  );
};

export default Offering;
