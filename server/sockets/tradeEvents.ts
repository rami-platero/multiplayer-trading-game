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
}