import { Schema, model } from "mongoose";

export interface IShopItem extends Document{
    shopItem: string
    price: number
}

const roleSchema = new Schema({
    shopItem: { type: Schema.Types.ObjectId, ref: "Item" },
    price: Number
})

export default model<IShopItem>("ShopItem", roleSchema)