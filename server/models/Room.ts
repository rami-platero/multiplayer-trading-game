import { model, Schema, Document,Types } from "mongoose";

export enum RoomType {
    Normal = "normal",
    VIP = "VIP"
}

export interface IRoom extends Document {
    name: string,
    users?: Types.ObjectId[],
    offers?: Types.ObjectId[],
    type: RoomType
}

const roomSchema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    offers: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
    type: {type: String, enum: Object.values(RoomType), required: true}
});

export default model<IRoom>('Room', roomSchema)