import { lobbyContext } from "../../../context/LobbyContext";
import { IOffer } from "../../../interfaces/interfaces";
import { useContext } from "react";
import "./offerItem.css";

interface Props {
  offer: IOffer;
}

const OfferItem = ({ offer }: Props) => {
  const { openOffer } = useContext(lobbyContext);

  return (
    <div
      className={`offer-box ${offer.tradingWith ? "locked" : "unlocked"}`}
      onClick={() => {
        openOffer(offer);
      }}
    >
      <img src={offer.itemOffering.image} className={`item ${offer.itemOffering?.type}`}/>
      <h3>{offer.createdBy.username}</h3>
    </div>
  );
};

export default OfferItem;
