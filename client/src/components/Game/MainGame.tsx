import "./game.css";
import { BsFillBoxFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import useLogOut from "../../hooks/useLogout";
import Profile from "../Profile/Profile";
import { IGameState } from "../../interfaces/interfaces";
import {
  TransitionFrom,
  transitionContext,
} from "../../context/transitionContext";
import { CSSTransition } from "react-transition-group";
import Coins from "../UI/Coins";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { btn_click_SFX, hover_btn_SFX } from "../SFX";
import Inventory from "../Inventory/Inventory";

export enum IMainState {
  Profile = "profile",
  Inventory = "inventory",
}

const MainGame = () => {
  const { user, setGameState } = useContext(userContext);
  const { changeFrom, setChangeFrom } = useContext(transitionContext);
  const { logout } = useLogOut();
  const [mainState, setMainState] = useState<IMainState | null>(null);

  const handleClickMarketplace = (): void => {
    setChangeFrom(TransitionFrom.selector);
    setGameState(IGameState.Selector);
    btn_click_SFX.play();
  };

  const handleClickInventory = ()=>{
    btn_click_SFX.play();
    setMainState(IMainState.Inventory)
  }

  const hoverSFX = ()=>{
    hover_btn_SFX.play();
  }

  const handleState = ()=>{
    setMainState(null)
  }

  return (
    <div className={`game-container ${changeFrom}`}>
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
      <div className="game-content">
        <CSSTransition
          in={mainState == IMainState.Profile}
          timeout={200}
          classNames={"grow"}
          unmountOnExit
        >
          <Profile setMainState={setMainState} />
        </CSSTransition>
        <CSSTransition
          in={mainState == IMainState.Inventory}
          timeout={200}
          classNames={"grow"}
          unmountOnExit
        >
          <Inventory handleState={handleState} />
        </CSSTransition>
        <div className="buttons">
          <button
            onClick={handleClickMarketplace}
            onMouseEnter={hoverSFX}
          >
            <FaUsers />
            MARKETPLACE
          </button>
          <button
            onMouseEnter={hoverSFX}
            onClick={handleClickInventory}
          >
            <BsFillBoxFill />
            INVENTORY
          </button>
          <button
            onMouseEnter={hoverSFX}
            className="shop-btn"
            onClick={() => {
              setGameState(IGameState.Shop);
              btn_click_SFX.play();
            }}
          >
            <RiShoppingCart2Fill />
            SHOP
          </button>
          <button
            onMouseEnter={hoverSFX}
            onClick={() => {
              btn_click_SFX.play();
            }}
            className="friends-btn"
          >
            <FaUserFriends />
            FRIENDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainGame;
