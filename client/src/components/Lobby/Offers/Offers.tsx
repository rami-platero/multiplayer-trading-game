import "./offers.css";
import Skin from "../../../assets/items/Dark-Skin.png";
import { useRef } from "react";

const Offers = () => {
  const intervalLeftRef = useRef<any>();
  const intervalRightRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (containerRef.current!.scrollLeft + containerRef.current!.offsetWidth !==
      containerRef.current!.scrollWidth) {
      intervalRightRef.current = setInterval(() => {
        if (containerRef.current!.scrollLeft + containerRef.current!.offsetWidth !==
          containerRef.current!.scrollWidth) {
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
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
          <div className="offer-box">
            <img src={Skin} alt="" />
            <h3>Stick Run Dev</h3>
          </div>
        </div>
      </div>
      <div className="offers-footer">
        <button>Open Offer</button>
      </div>
    </div>
  );
};

export default Offers;
