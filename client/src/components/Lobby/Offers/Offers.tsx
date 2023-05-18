import "./offers.css";
import { useContext, useRef, useEffect } from "react";
import { lobbyContext } from "../../../context/LobbyContext";
import OfferItem from "./OfferItem";
import Inventory from "../../Inventory/Inventory";
import { CSSTransition } from "react-transition-group";
import { hover_btn_SFX } from "../../SFX";
import { InventoryState, userContext } from "../../../context/UserContext";

const Offers = () => {
  const intervalLeftRef = useRef<any>();
  const intervalRightRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { offers} =
    useContext(lobbyContext);
  const { openInventory, isInventoryOpen,setInventoryState,inventoryState } = useContext(userContext);

  useEffect(() => {
    setInventoryState(InventoryState.Offer);
  }, []);

  const handleLeft = () => {
    if (containerRef.current!.scrollLeft !== 0) {
      intervalLeftRef.current = setInterval(() => {
        if (containerRef.current!.scrollLeft !== 0) {
          containerRef.current!.scrollBy({ left: -30, behavior: "smooth" });
        } else {
          clearInterval(intervalLeftRef.current);
        }
      }, 100);
    }
  };

  const handleLeftOut = () => {
    clearInterval(intervalLeftRef.current);
  };

  const handleRight = () => {
    if (
      containerRef.current!.scrollLeft + containerRef.current!.offsetWidth !==
      containerRef.current!.scrollWidth
    ) {
      intervalRightRef.current = setInterval(() => {
        if (
          containerRef.current!.scrollLeft +
            containerRef.current!.offsetWidth !==
          containerRef.current!.scrollWidth
        ) {
          containerRef.current!.scrollBy({ left: 30, behavior: "smooth" });
        } else {
          clearInterval(intervalRightRef.current);
        }
      }, 100);
    }
  };

  const handleRightOut = () => {
    clearInterval(intervalRightRef.current);
  };

 

  return (
    <div className="offers-container">
      <CSSTransition
        in={isInventoryOpen === true && inventoryState === InventoryState.Offer}
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <Inventory />
      </CSSTransition>
      <div className="offers-wrapper">
        <div
          className="left-hover"
          onMouseEnter={handleLeft}
          onMouseOut={handleLeftOut}
          ref={intervalLeftRef}
        ></div>
        <div
          className="right-hover"
          onMouseEnter={handleRight}
          onMouseOut={handleRightOut}
        ></div>
        <div className="offers" ref={containerRef}>
          {offers?.map((offer) => {
            return <OfferItem key={offer._id} offer={offer} />;
          })}
        </div>
      </div>
      <div className="offers-footer">
        <button
          onClick={openInventory}
          onMouseEnter={() => {
            hover_btn_SFX.play();
          }}
        >
          Make Offer
        </button>
      </div>
    </div>
  );
};

export default Offers;
