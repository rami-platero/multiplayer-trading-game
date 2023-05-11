import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import Inv_Item from "./Inv_Item";
import './inventory.css'


interface Props{
  handleState: ()=> void
}

const Inventory = ({handleState}: Props) => {
  const { user } = useContext(userContext);

  return (
    <div className="inventory-container">
      <div className="inventory-top-elements">
        <div className="header">
          <h2>Items</h2>
          <button>Remove</button>
        </div>
        <button onClick={handleState}>Close</button>
      </div>
      <div className="items-wrapper">
        {user?.items.map((item) => {
          return (
           <Inv_Item item={item}/>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
