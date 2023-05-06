import "./App.css";
import { useState, useContext, useRef, useEffect } from "react";
import AuthScreen from "./components/Auth/AuthScreen";
import { userContext } from "./context/UserContext";
import { IGameState } from "./interfaces/interfaces";
import MainGame from "./components/Game/MainGame";
import { CSSTransition } from "react-transition-group";
import Shop from "./components/Shop/Shop";
import useScaleContainer from "./hooks/useScaleContainer";
import LobbySelector from "./components/Lobby Selector/LobbySelector";
import Lobby from "./components/Lobby/Lobby";
import {StickGame} from "./Game/StickGame";
import  Game  from "./Game/gameIndex";

const App = () => {
  /* const { user, gameState } = useContext(userContext); */
  const screenRef = useRef<HTMLDivElement>(null);
  const [screenStyle, setScreenStyle] = useState<boolean>(false);
  const containerRef = useScaleContainer(1600);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  /* const containerRef = useScaleContainer(1250); */

  const handleFullscreen = () => {
    screenRef.current!.requestFullscreen();
    setScreenStyle(true);
  };

  useEffect(() => {
    screenRef.current!.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 1280,
        height: 720,
        scene: [Game]
      };

      new Phaser.Game(config);
    }
    return () => {
      screenRef.current!.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleFullscreenChange = () => {
    if (document.fullscreenElement !== screenRef.current!) {
      setScreenStyle(false);
    }
  };



  return (
    <>
      <button
        style={{ position: "absolute", top: "0" }}
        onClick={handleFullscreen}
      >
        full screen
      </button>
      <div
        className="game-parent"
        style={{
          width: screenStyle ? "1920px" : "1280px",
          height: screenStyle ? "1080px" : "720px",
        }}
        ref={containerRef}
      >
        <div className="main-game-wrapper" ref={screenRef}>
          {/* {!user && gameState == IGameState.Auth && <AuthScreen />}
          <CSSTransition
            in={gameState === IGameState.Main}
            timeout={300}
            classNames="slide"
            key={"slide"}
            unmountOnExit
          >
            <MainGame />
          </CSSTransition>
          <CSSTransition
            in={gameState === IGameState.Shop}
            timeout={300}
            classNames="slide"
            unmountOnExit
          >
            <Shop />
          </CSSTransition>
          <CSSTransition
            in={gameState == IGameState.Selector}
            timeout={200}
            classNames={"slide2"}
            unmountOnExit
          >
            <LobbySelector />
          </CSSTransition>
          {gameState == IGameState.Lobby && <Lobby />} */}
          <StickGame ref={gameContainerRef} id="game-container"/>
        </div>
      </div>
    </>
  );
};

export default App;

{
  /* <div className="game-parent">
  <div className="offers"></div>
  <div className="online"></div>
  <div className="chat"></div>
</div> */
}
