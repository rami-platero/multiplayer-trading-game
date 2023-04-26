import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
dotenv.config();
import { userRouter } from "./routes/users.js";
import http from "http";
import { initSocket } from "./sockets/socket.js";

export const app = express();
export const server = http.createServer(app);
initSocket()

app.use(cors());
app.use(morgan("dev"));

app.use("/", userRouter);

app.set("port", process.env.PORT);
