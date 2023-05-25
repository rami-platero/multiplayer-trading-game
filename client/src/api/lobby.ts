import axios from 'axios'

export const makeTrade = async (id:string,room:string) =>{
    await axios.post(`http://localhost:4000/trade/${id}`,{room})
}