import { model, Schema, Document, Types, Model } from "mongoose";
import { IUser } from "./User";
import Trade, { ITrade } from "./Trade";

export enum RoomType {
  Normal = "normal",
  VIP = "VIP",
}

export interface IRoom extends Document {
    name: string;
    users?: Types.ObjectId[] | IUser[];
    offers?: Types.ObjectId[] | ITrade[];
    type: RoomType;
}

interface RoomModel extends Model<IUser> {
    getLobby(room_name: string, user: IUser):Promise<IRoom>
}

const roomSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  offers: [{ type: Schema.Types.ObjectId, ref: "Trade" }],
  type: { type: String, enum: Object.values(RoomType), required: true },
});

roomSchema.statics.getLobby = async function (room_name: string, user: IUser) {
  const room = await this.findOneAndUpdate(
    { name: room_name },
    {
      $push: {
        users: user._id,
      },
    },
    {
      new: true,
    }
  )
    .populate({
        path: 'users',
        select: 'username skin socketID roles'
    }).populate({
      path: 'offers',
      model: Trade,
      populate: {
        path: 'createdBy tradingWith itemTrading'
      }
  })

  return room
};

export default model<IRoom, RoomModel>("Room", roomSchema);
