import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import Inv_Item from "./Inv_Item";
import "./inventory.css";
import { IoMdRemoveCircle } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

interface Props {
  handleState: () => void;
}

const Inventory = ({ handleState }: Props) => {
  const { user } = useContext(userContext);
  const [filters, setFilters] = useState<string[]>([])

  const filteredItems = !filters.length? user?.items : user!.items.filter((item)=>{
    return filters.some((filter)=>{
      return filter === item.itemId.type
    })
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.checked){
      setFilters(filters.filter((fil)=>{
        return fil != e.target.value
      }))
    } else {
      setFilters([...filters, e.target.value])
    }
  }

  return (
    <div className="inventory-container">
      <div className="inventory-top-elements">
        <div className="header">
          <h2>ITEMS</h2>
          <button>
            <IoMdRemoveCircle /> Remove Item
          </button>
        </div>
        <button onClick={handleState} className="close-btn">
          <IoMdClose />
        </button>
      </div>
      <hr />
      <div className="filters">
        <h3>FILTER BY TYPE</h3>
        <div className="radio-filter-wrapper">
          <input type="checkbox" name="item_type" onChange={handleChange} value="rare"/>
          <label className="rare" htmlFor="item_type">Rare</label>
        </div>
        <div className="radio-filter-wrapper">
          <input type="checkbox" name="item_type" value="common" onChange={handleChange}/>
          <label className="common" htmlFor="item_type">Common</label>
        </div>
      </div>
      <div className="items-wrapper">
        {filteredItems?.map((item) => {
          return <Inv_Item item={item} />;
        })}
      </div>
    </div>
  );
};

export default Inventory;
