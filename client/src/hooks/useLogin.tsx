import { useContext } from "react";
import { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";
import { API_URL } from "../config/config";
import useToast from "./useToast";

const useLogin = () => {
  const { authDispatch, socketID, setGameState, socket, setLoading } =
    useContext(userContext);

    const {notifyError} = useToast()

  const login = async (
    form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>
  ) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...form, socketID }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrors(json);
      }

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(json));
        socket?.emit("login", json?.username);
        authDispatch({ type: "LOGIN", payload: json });
        setGameState(IGameState.Main);
      }
      
    } catch (error) {
      if (error instanceof Error) {
        notifyError("Server is starting, please try again in a minute.");
      }
    } finally{
      setLoading(false);
    }
  };

  return { login };
};

export default useLogin;
