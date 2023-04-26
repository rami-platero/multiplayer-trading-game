import { model, Schema } from "mongoose";

const roomSchema = new Schema({
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    offers: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],
});

export default model('Room', roomSchema)