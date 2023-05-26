import { shopContext } from "../../context/ShopContext";
import { useContext } from "react";
import "./purchaseModal.css";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import '../../context/transitions.css'


const PurchaseModal = () => {
  const { purchaseModal, closePurchaseModal } = useContext(shopContext);

  return (
    <div className={`purchase-modal ${purchaseModal.error}`}>
      <div className="icon">
        {purchaseModal.error ? <AiOutlineCloseCircle /> : <MdOutlineDone />}
      </div>
      <div className="error-wrapper">
        <h1>{purchaseModal.error ? "ERROR" : "SUCCESS!"}</h1>
        <p>{purchaseModal.message}</p>
        {purchaseModal.error === false && (
          <img src={`../src/assets/items/${purchaseModal.itemIMG}`} />
        )}
      </div>
      <div className="close-btn" onClick={closePurchaseModal}>
        <IoMdClose />
      </div>
    </div>
  );
};

export default PurchaseModal;
