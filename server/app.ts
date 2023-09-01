import express from "express";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./routes/users";
import http from "http";
import { initSocket } from "./sockets/socket";
import { tradeRouter } from "./routes/trades";
import { errorHandler } from "./middlewares/errorHandler";
import { CLIENT_BASE_URL } from "./config";

export const app = express();
export const server = http.createServer(app);
initSocket();

app.use(express.json());

app.use(morgan("dev"));
app.use(cors())
app.use((_req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', CLIENT_BASE_URL!);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
    return next()
})

app.get("/test", (_req,res)=>{
    res.send("works")
})
app.use("/", userRouter, tradeRouter);
app.use(errorHandler)

app.set("port", process.env.PORT || 4000);
