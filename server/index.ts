import { connectDB } from "./connectDB";
import {app,server} from './app'
import { createItems, createRoles } from "./libs/intialSetup";
connectDB()
createRoles()
createItems()

server.listen(app.get("port"))
console.log("listening on port", app.get("port"))