import "./authForm.css";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

const Login = () => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <form>
        <div className="input">
          <AiOutlineUser />
          <input type="text" placeholder="Username" autoCorrect="off" />
        </div>
        <div className="input">
          <AiOutlineLock />
          <input
            type={`${show ? "text" : "password"}`}
            placeholder="Password"
          />
          {show ? (
            <AiOutlineEyeInvisible
              onClick={() => {
                setShow(!show);
              }}
            />
          ) : (
            <AiOutlineEye
              onClick={() => {
                setShow(!show);
              }}
            />
          )}
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
