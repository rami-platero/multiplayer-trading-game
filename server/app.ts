import express, { Response } from "express";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./routes/users";
import http from "http";
import { initSocket } from "./sockets/socket";
import { tradeRouter } from "./routes/trades";

export const app = express();
export const server = http.createServer(app);
initSocket();

app.use(express.json());

app.use(morgan("dev"));
app.use(cors({
    origin: "https://multiplayer-trading-game.vercel.app"
}))
app.use((_req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', 'https://multiplayer-trading-game.vercel.app');
    return next()
})

app.use("/", userRouter, tradeRouter);


app.set("port", process.env.PORT);
