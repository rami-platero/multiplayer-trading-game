import { IMainState } from "./MainGame";
import { SetStateAction } from "react";
import "./RoomSelector.css";

interface Props {
  setMainState: React.Dispatch<SetStateAction<IMainState | null>>;
}

const RoomSelector = ({ setMainState }: Props) => {
  return (
    <div className="room-selector-container">
      <div className="normal-lobbies">
        Normal Lobbies
        <button>A</button>
        <button>B</button>
        <button>C</button>
        <button>D</button>
        <button>E</button>
      </div>
      <div className="vip-lobbies">
        VIP Lobbies
        <button>A+</button>
        <button>B+</button>
        <button>C+</button>
        <button>D+</button>
        <button>E+</button>
      </div>
      {/* <button className="close-btn">
        
      </button> */}
    </div>
  );
};

export default RoomSelector;
