import { model, Schema, Document,Types } from "mongoose";

export interface IRoom extends Document {
    name: string,
    users?: Types.ObjectId[],
    offers?: Types.ObjectId[]
}

const roomSchema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    offers: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
});

export default model<IRoom>('Room', roomSchema)