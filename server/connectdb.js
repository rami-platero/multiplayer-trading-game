import * as dotenv from 'dotenv' 
dotenv.config()
import { connect } from "mongoose";

export const connectDB = async ()=>{
    try {
        await connect(process.env.MONGODB_URI)
        console.log('connected to db')

    } catch (error) {
        console.log("couldn't connect to server")
    }
}
