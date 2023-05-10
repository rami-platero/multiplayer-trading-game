import { useContext } from "react";
import Coin from "../../assets/coin.gif";
import './coins.css'
import { userContext } from "../../context/UserContext";

interface props{
    style: React.CSSProperties
}

function Coins({style}:props) {
  const {user} = useContext(userContext)
  return (
    <div className="coins-wrapper" style={style}>
      <img src={Coin} className="coin" />
      {user?.coins}
    </div>
  );
}

export default Coins;
