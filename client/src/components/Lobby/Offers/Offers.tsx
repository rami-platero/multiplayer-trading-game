import "./offers.css";
import { useContext, useRef } from "react";
import { lobbyContext } from "../../../context/LobbyContext";
import OfferItem from "./OfferItem";

const Offers = () => {
  const intervalLeftRef = useRef<any>();
  const intervalRightRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { offers } = useContext(lobbyContext);

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

  return (
    <div className="offers-container">
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
            return (
              <OfferItem key={offer._id} offer={offer}/>
            );
          })}
        </div>
      </div>
      <div className="offers-footer">
        <button>Open Offer</button>
      </div>
    </div>
  );
};

export default Offers;
