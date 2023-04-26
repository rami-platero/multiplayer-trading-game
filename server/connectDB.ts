import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { connect } from "mongoose";
const uri:any = process.env.MONGODB_URI

export const connectDB = async ()=>{
    try {
        await connect(uri)
        console.log('connected to db')

    } catch (error) {
        console.log("couldn't connect to server")
    }
}