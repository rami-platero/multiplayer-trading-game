import { userContext } from "../../context/UserContext";
import { transitionContext } from "../../context/transitionContext";
import { useContext } from "react";
import { TransitionFrom } from "../../context/transitionContext";
import { IGameState } from "../../interfaces/interfaces";
import { BsArrowLeftShort } from "react-icons/bs";
import "./BackBtn.css";
import { btn_click_SFX, hover_btn_SFX } from "../SFX";

interface Props {
  transition?: TransitionFrom;
}

const BackBtn = ({ transition }: Props) => {
  const { setGameState } = useContext(userContext);
  const { setChangeFrom } = useContext(transitionContext);

  const handleClick = async (): Promise<void> => {
    btn_click_SFX.play();
    if (transition) {
      setChangeFrom(() => transition);
      setGameState(IGameState.Main);
      setTimeout(() => {
        setChangeFrom(() => TransitionFrom.none);
      }, 400);
    } else {
      setChangeFrom(() => TransitionFrom.none);
      setGameState(IGameState.Main);
    }
  };

  return (
    <button
      className="back-btn"
      onClick={handleClick}
      onMouseEnter={() => {
        hover_btn_SFX.play();
      }}
    >
      <BsArrowLeftShort /> Back to Menu
    </button>
  );
};

export default BackBtn;
