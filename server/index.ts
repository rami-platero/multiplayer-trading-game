import { connectDB } from "./connectDB";
import {app,server} from './app'
connectDB()

server.listen(app.get("port"))
console.log("listening on port", app.get("port"))