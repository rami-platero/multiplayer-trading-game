import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";

const useLogOut = () => {
  const { authDispatch, setGameState, socket, user } = useContext(userContext);

  const logout = (): void => {
    authDispatch({ type: "LOG_OUT" });
    setGameState(IGameState.Auth);
    socket?.emit("logout", user?.username);
  };

  return { logout };
};

export default useLogOut;
