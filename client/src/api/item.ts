import axios from "axios";

export const POST_buyItem = async (userID: string, id: string)=>{
    const res = await axios.post(`http://localhost:4000/buyItem/${id}`,{userID})
    return res
}

export const deleteItem = async (userID: string, id:string)=>{
    const res = await axios.post(`http://localhost:4000/removeItem/${id}`,{userID})
    return res
}