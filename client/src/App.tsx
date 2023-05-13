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
import { StickGame } from "./Game/StickGame";
import Game from "./Game/gameIndex";
import { transitionContext } from "./context/transitionContext";

const App = () => {
  const { user, gameState } = useContext(userContext);
  const screenRef = useRef<HTMLDivElement>(null);
  const [screenStyle, setScreenStyle] = useState<boolean>(false);
  const containerRef = useScaleContainer(1600);
  const { selectorTimeout } = useContext(transitionContext);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  /* const containerRef = useScaleContainer(1250); */

  /* const handleFullscreen = () => {
    screenRef.current!.requestFullscreen();
    setScreenStyle(true);
    resizeGame();
  };

  const handleFullscreenChange = () => {
    if (document.fullscreenElement !== screenRef.current!) {
      setScreenStyle(false);
      resizeGame();
    }
  };

  const resizeGame = () => {
    if (gameRef.current) {
      const width = screenStyle ? 1920 : 1280;
      const height = screenStyle ? 1080 : 720;
      gameRef.current!.scale.resize(width, height);
    }
  };

  useEffect(() => {
    screenRef.current!.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
    return () => {
      screenRef.current!.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    resizeGame();
  }, [screenStyle]);

  useEffect(() => {
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 1280,
        height: 720,
        scene: [Game],
        backgroundColor: 0xadd8e6,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 500 },
            debug: false,
          },
        },
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true, false);
      }
    };
  }, []); */

  return (
    <>
      <button
        style={{ position: "absolute", top: "0" }}
        /* onClick={handleFullscreen} */
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
          {!user && gameState == IGameState.Auth && <AuthScreen />}
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
            timeout={selectorTimeout}
            classNames={"slide2"}
            unmountOnExit
          >
            <LobbySelector />
          </CSSTransition>
          {gameState == IGameState.Lobby && <Lobby />}
          {/* <StickGame ref={gameContainerRef} id="game-container" /> */}
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
