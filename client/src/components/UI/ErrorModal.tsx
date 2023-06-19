import { userContext } from "../../context/UserContext";
import { useContext } from "react";
import "./error_message.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ErrorModal = () => {
  const { errorMessage, closeErrorMessage } = useContext(userContext);
  return (
    <div className="error-message">
      <AiOutlineCloseCircle />
      <p>{errorMessage}</p>
      <button onClick={closeErrorMessage}>Dismiss</button>
    </div>
  );
};

export default ErrorModal;
