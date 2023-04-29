import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { MdAlternateEmail } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useState } from "react";
import useAuthForm from "./useAuthForm";

const INITIAL_STATE = {
  username: "",
  email: "",
  password: ""
}

const Register = () => {
  const [show, setShow] = useState<boolean>(false);
  const {handleChange,handleSubmit,errors} = useAuthForm(INITIAL_STATE)

  return (
    <form onSubmit={(e)=>{
      handleSubmit(e,true)
    }}>
      <div className={`input ${errors?.username && "error"}`}>
        <AiOutlineUser />
        <input type="text" placeholder="Username" autoCorrect="off" name="username" onChange={handleChange} autoComplete="off"/>
        {/* <AiOutlineCheckCircle /> */}
      </div>
      {errors?.username && <span className="error-text">{errors.username}</span>}
      <div className={`input ${errors?.email && "error"}`}>
        <MdAlternateEmail />
        <input type="text" placeholder="Email" name="email" onChange={handleChange} autoComplete="off"/>
      </div>
      {errors?.email && <span className="error-text">{errors.email}</span>}

      <div className={`input ${errors?.password && "error"}`}>
        <AiOutlineLock />
        <input type={`${show ? "text" : "password"}`} placeholder="Password" name="password" onChange={handleChange}/>
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

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;
