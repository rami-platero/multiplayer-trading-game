import axios from "axios";

export const POST_buyItem = async (userID: string, id: string)=>{
    const res = await axios.post(`/buyItem/${id}`,{userID})
    return res
}

export const deleteItem = async (userID: string, id:string)=>{
    const res = await axios.post(`/removeItem/${id}`,{userID})
    return res
}