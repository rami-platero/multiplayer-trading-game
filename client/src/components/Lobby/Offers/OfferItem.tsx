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
      <img src={`../src/assets/items/${offer.itemOffering.image}`} />
      <h3>{offer.createdBy.username}</h3>
    </div>
  );
};

export default OfferItem;
