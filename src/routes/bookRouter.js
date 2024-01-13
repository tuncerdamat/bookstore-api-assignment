import express from "express"
import BookModel from "../db/models/books.js"
const router = express.Router()

router.get("/books", async (request, response) => {
    try {
        const books = await BookModel.find({})
        response.send(books)
    } catch (error) {
        response.status(500).send(error)
    }
})

export default router
