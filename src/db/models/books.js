import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 2,
    },
    author: {
        type: String,
        require: true,
        minlength: 2
    },
})

const BookModel = mongoose.model('books', bookSchema)
export default BookModel
