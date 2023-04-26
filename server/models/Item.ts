import { Schema, model } from "mongoose";

const itemSchema = new Schema({
    name: String,
    type: String,
    image: String,
})

export default model('Item', itemSchema)