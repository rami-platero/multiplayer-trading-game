import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

export const CLIENT_BASE_URL = process.env.NODE_ENV === "development"? "http://localhost:5173" : process.env.CLIENT_URL