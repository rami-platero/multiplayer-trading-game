import { Schema, model } from "mongoose";

interface IRole extends Document{
    name: string
}

const roleSchema = new Schema({
    name: {type: String, required: true}
})

export default model<IRole>("Role", roleSchema)