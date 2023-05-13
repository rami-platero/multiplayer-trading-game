import { IOffer } from "../../../interfaces/interfaces";
import Skin from "../../../assets/items/Dark-Skin.png";

interface Props {
    offer: IOffer
}

const OfferItem = ({offer}:Props) => {


  return (
    <div className="offer-box">
      <img src={Skin} alt="" />
      <h3>{offer.createdBy}</h3>
    </div>
  );
};

export default OfferItem;
