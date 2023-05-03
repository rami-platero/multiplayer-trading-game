import { userContext } from "../../context/UserContext";
import { transitionContext } from "../../context/transitionContext";
import { useContext } from "react";
import { TransitionFrom } from "../../context/transitionContext";
import { IGameState } from "../../interfaces/interfaces";
import { BsArrowLeftShort } from "react-icons/bs";
import './BackBtn.css'

interface Props {
  transition?: TransitionFrom;
}

const BackBtn = ({ transition }: Props) => {
  const { setGameState } = useContext(userContext);
  const { setChangeFrom } = useContext(transitionContext);
  return (
    <button
    className="back-btn"
      onClick={async () => {
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
      }}
    >
      <BsArrowLeftShort /> Back to Menu
    </button>
  );
};

export default BackBtn;
