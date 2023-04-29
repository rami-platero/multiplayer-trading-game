import "./authForm.css";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import useAuthForm from "./useAuthForm";

const INITIAL_STATE = {
  username: "",
  password: "",
};

const Login = () => {
  const [show, setShow] = useState<boolean>(false);
  const { handleChange, handleSubmit, errors } = useAuthForm(INITIAL_STATE);

  return (
    <>
      <form onSubmit={(e)=>{
      handleSubmit(e,false)
    }}>
        <div className={`input ${errors?.username && "error"}`}>
          <AiOutlineUser />
          <input
            type="text"
            placeholder="Username"
            autoCorrect="off"
            autoComplete="off"
            name="username"
            onChange={handleChange}
          />
        </div>
        {errors?.username && <span className="error-text">{errors.username}</span>}
        <div className={`input ${errors?.password && "error"}`}>
          <AiOutlineLock />
          <input
            type={`${show ? "text" : "password"}`}
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          {show ? (
            <AiOutlineEye
              onClick={() => {
                setShow(!show);
              }}
            />
          ) : (
            <AiOutlineEyeInvisible
              onClick={() => {
                setShow(!show);
              }}
            />
          )}
        </div>
        {errors?.password && <span className="error-text">{errors.password}</span>}
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
