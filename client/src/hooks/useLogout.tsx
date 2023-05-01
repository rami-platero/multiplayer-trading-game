import { SetStateAction, useContext } from "react";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";

const useLogOut = () => {
  const { authDispatch, setGameState } = useContext(userContext);

  const logout = (): void => {
    authDispatch({ type: "LOG_OUT" });
    setGameState(IGameState.Auth);
  };

  return { logout };
};

export default useLogOut;
