import mongoose from "mongoose"

export default function connectDatabase() {
    // MongoDB connection string
    const MONGODB_URI = process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_URI_TEST
        : process.env.MONGODB_URI_DEV

    try {
        mongoose.connect(MONGODB_URI)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
    const dbConnection = mongoose.connection
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${MONGODB_URI}`)
    })

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`)
    })
}
