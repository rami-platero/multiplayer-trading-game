import Coin from "../../assets/coin.gif";
import './coins.css'

interface props{
    style: React.CSSProperties
}

function Coins({style}:props) {
  return (
    <div className="coins-wrapper" style={style}>
      <img src={Coin} className="coin" />
      5400
    </div>
  );
}

export default Coins;
