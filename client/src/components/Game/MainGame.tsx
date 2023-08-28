import "./game.css";
import { BsFillBoxFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import { InventoryState, userContext } from "../../context/UserContext";
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
/* import { FaUserFriends } from "react-icons/fa"; */
import { AiFillSkin } from "react-icons/ai";
import { btn_click_SFX, hover_btn_SFX } from "../SFX";
import Inventory from "../Inventory/Inventory";
import SkinSelector from "../SkinSelector/SkinSelector";

export enum IMainState {
  Profile = "profile",
  Inventory = "inventory",
  SkinSelector = "skinSelector",
}

const MainGame = () => {
  const { user, setGameState,isInventoryOpen,openInventory,setInventoryState } = useContext(userContext);
  const { changeFrom, setChangeFrom } = useContext(transitionContext);
  const { logout } = useLogOut();
  const [mainState, setMainState] = useState<IMainState | null>(null);

  useEffect(()=>{
    setInventoryState(null)
  },[])

  const handleClickMarketplace = (): void => {
    setChangeFrom(TransitionFrom.selector);
    setGameState(IGameState.Selector);
    btn_click_SFX.play();
  };

  const hoverSFX = () => {
    hover_btn_SFX.play();
  };

  const handleState = () => {
    setMainState(null);
  };

  useEffect(()=>{
    setInventoryState(InventoryState.Menu)
  },[])

  return (
    <div className={`game-container ${changeFrom}`}>
      <Coins style={{ left: "0" }} />
      <CSSTransition
        in={mainState == IMainState.Profile}
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <Profile setMainState={setMainState} />
      </CSSTransition>
      <CSSTransition
        in={isInventoryOpen === true}
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <Inventory />
      </CSSTransition>
      <CSSTransition
        in={mainState == IMainState.SkinSelector}
        timeout={200}
        classNames={"grow"}
        unmountOnExit
      >
        <SkinSelector handleState={handleState} />
      </CSSTransition>
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
      {/* <span className="version">Version: 0.0.0</span> */}
      <div className="game-content">
        <div className="buttons">
          <button onClick={handleClickMarketplace} onMouseEnter={hoverSFX}>
            <FaUsers />
            MARKETPLACE
          </button>
          <button onMouseEnter={hoverSFX} onClick={openInventory}>
            <BsFillBoxFill />
            INVENTORY
          </button>
          <button
            onMouseEnter={hoverSFX}
            onClick={() => {
              setMainState(IMainState.SkinSelector);
              btn_click_SFX.play();
            }}
          >
            <AiFillSkin /> CHANGE SKIN
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

          {/* <button
            onMouseEnter={hoverSFX}
            onClick={() => {
              btn_click_SFX.play();
            }}
            className="friends-btn"
          >
            <FaUserFriends />
            FRIENDS
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default MainGame;
