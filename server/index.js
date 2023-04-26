import { connectDB } from './connectdb.js'
import {app,server} from './app.js'
connectDB()

server.listen(app.get("port"))
console.log("listening on port", app.get("port"))

