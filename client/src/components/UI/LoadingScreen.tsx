import Loader from "../../assets/loader.gif";
import './loadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img className="loader" src={Loader} />
    </div>
  );
};

export default LoadingScreen;
