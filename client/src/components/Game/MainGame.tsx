import useScaleContainer from "../../hooks/useScaleContainer";
import "./game.css";
import "./transitions.css";
import { RiCoinLine } from "react-icons/ri";
import { BsFillBoxFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import useLogOut from "../../hooks/useLogout";
import Profile from "../Profile/Profile";
import { IGameState } from "../../interfaces/interfaces";
import { transitionContext } from "../../context/transitionContext";
import { CSSTransition } from "react-transition-group";
import Coins from "../UI/Coins";

export enum IMainState {
  Profile = "profile",
  Inventory = "inventory",
  Marketplace = "marketplace",
}

const MainGame = () => {
  const containerRef = useScaleContainer(1408);
  const { user, setGameState } = useContext(userContext);
  const { fromShop } = useContext(transitionContext);
  const { logout } = useLogOut();
  const [mainState, setMainState] = useState<IMainState | null>(null);

  return (
    <div className={`game-container ${fromShop}`}>
      <Coins style={{ left: "0" }} />
      <div className="profile-actions">
        <button
          onClick={() => {
            setMainState(IMainState.Profile);
          }}
        >
          <BiUser />
          {user?.username}
        </button>
        <button onClick={logout}>Log Out</button>
      </div>
      <span className="version">Version: 0.0.0</span>
      <div className="game-content" ref={containerRef}>
        <CSSTransition
          in={mainState == IMainState.Profile}
          timeout={200}
          classNames={"grow"}
          unmountOnExit
        >
          <Profile setMainState={setMainState} />
        </CSSTransition>
        <div className="game-wrapper">
          {/* <h1>Welcome!</h1> */}
          <div className="buttons">
            <button>
              <FaUsers />
              MARKETPLACE
            </button>
            <button>
              <BsFillBoxFill />
              INVENTORY
            </button>
            <button
              className="shop-btn"
              onClick={() => {
                setGameState(IGameState.Shop);
              }}
            >
              <RiCoinLine />
              SHOP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGame;
