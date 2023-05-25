import { connectDB } from "./connectDB";
import { app, server } from "./app";
import { createItems } from "./libs/intialSetup";
/* import { createItems, createRoles, createRooms } from "./libs/intialSetup"; */
connectDB();

/*INITIAL SETUP
createRoles()
createRooms()
*/


server.listen(app.get("port"));
console.log("listening on port", app.get("port"));
