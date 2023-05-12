import "./offers.css";
import { useContext, useRef, useState } from "react";
import { InventoryState, lobbyContext } from "../../../context/LobbyContext";
import OfferItem from "./OfferItem";
import Inventory from "../../Inventory/Inventory";
import { CSSTransition } from "react-transition-group";

const Offers = () => {
  const intervalLeftRef = useRef<any>();
  const intervalRightRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { offers, setInventoryState, inventoryState } = useContext(lobbyContext);


  const handleLeft = () => {
    if (containerRef.current!.scrollLeft !== 0) {
      intervalLeftRef.current = setInterval(() => {
        if (containerRef.current!.scrollLeft !== 0) {
          containerRef.current!.scrollBy({ left: -30, behavior: "smooth" });
          //console.log("scrolling left");
        } else {
          //console.log("clearing interval");
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
          //console.log("scrolling Right");
        } else {
          //console.log("clearing interval")
          clearInterval(intervalRightRef.current);
        }
      }, 100);
    }
  };

  const handleRightOut = () => {
    clearInterval(intervalRightRef.current);
  };

  const makeOffer = ()=>{
    setInventoryState(InventoryState.Offer)
  }

  return (
    <div className="offers-container">
      <CSSTransition
        in={inventoryState == InventoryState.Offer}
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <Inventory/>
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
        <button onClick={makeOffer}>Open Offer</button>
      </div>
    </div>
  );
};

export default Offers;
