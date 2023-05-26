import { useContext } from "react";
import { IErrors, IForm } from "../components/Auth/useAuthForm";
import { userContext } from "../context/UserContext";
import { IGameState } from "../interfaces/interfaces";

const useSignUp = () => {
  const { authDispatch, socketID,setGameState,setLoading,socket } = useContext(userContext);

  const signup = async (
    form: IForm,
    setErrors: React.Dispatch<React.SetStateAction<IErrors | null>>
  ) => {
    setLoading(true);

    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...form, socketID }),
    });
    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      setErrors(json.error);
      console.log(json.error);
    }

    if (res.ok) {
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(json));
      socket?.emit('login', json?.username)
      authDispatch({ type: "LOGIN", payload: json });
      setGameState(IGameState.Main)
    }
  };

  return { signup };
};

export default useSignUp;
