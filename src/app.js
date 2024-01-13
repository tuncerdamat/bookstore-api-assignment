import express from "express"
import connectDatabase from "./db/database.js"
import dotenv from "dotenv"
dotenv.config()
import UserRouter from "./routes/userRouter.js"
import BookRouter from "./routes/bookRouter.js"
const app = express()
const port = process.env.PORT || 3000

// initializing the middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', UserRouter)
app.use('/api', BookRouter)

connectDatabase()

const server = app.listen(port, () => console.log(`Server listening on port: ${port}`))

export default server
