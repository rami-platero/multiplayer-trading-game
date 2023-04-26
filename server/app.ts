import express from "express";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import cors from 'cors'
import morgan from 'morgan'
import { userRouter } from "./routes/users";
import http from "http";
import { initSocket } from "./sockets/socket";

export const app = express();
export const server = http.createServer(app);
initSocket()

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))

app.use("/", userRouter);

app.set("port", process.env.PORT);