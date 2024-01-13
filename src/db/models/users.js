import mongoose from "mongoose"
import validator from "validator"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate( isEmail ) {
            if( !validator.isEmail(isEmail) )
                throw new Error('Invalid email')
        },
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    orders: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'books'
            }
        }
    ],
})

const UserModel = mongoose.model('users', userSchema)
export default UserModel
