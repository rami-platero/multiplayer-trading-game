import axios from 'axios'

export const makeTrade = async (id:string,room:string) =>{
    await axios.post(`/trade/${id}`,{room})
}