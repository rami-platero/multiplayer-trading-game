import { Server, Socket, Server as SocketServer } from "socket.io";

import Item from "../models/Item";

export const tradeEvents = (socket:Socket, io: Server)=>{
    socket.on('TRADER:ADD-ITEM', (obj) => {
        const {item,socketID,index}: {item: typeof Item, socketID: string,index: number} = obj
        io.to(socketID).emit('TRADE:ADD-ITEM', {item: {
            itemId: item,
            count: 1
        }, index})
    })
    socket.on('TRADER:REMOVE-ITEM', obj => {
        const {index,socketID}:{index:number,socketID:string}=obj
        io.to(socketID).emit('TRADE:REMOVE-ITEM', index)
    })
    socket.on('TRADER:ADDS_ITEM_AMOUNT', obj => {
        const {index,socketID}:{index:number,socketID:string}=obj
        io.to(socketID).emit("TRADE:ADD_ITEM_AMOUNT", index)
    })
}