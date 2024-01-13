import express from "express"
import UserModel from "../db/models/users.js"
import BookModel from "../db/models/books.js"

const router = express.Router()

router.post("/user/registerUser", async (request, response) => {
    const user = new UserModel(request.body)

    try {
        await user.save()
        response.status(201).send(user)
    } catch (error) {
        response.status(500).send(error)
    }
})

router.post('/user/makeOrder', async (request, response) => {
    const {email, bookNames} = request.body

    try {
        if (!bookNames || bookNames.length === 0) {
            return response.status(400).send({Message: 'No books provided for purchase...'})
        }

        if (!email) {
            return response.status(400).send({Message: 'Please provide an email.'})
        }

        const user = await UserModel.findOne({email: email})

        if (!user) {
            return response.status(404).send({Message: 'User not found.'})
        }

        for (let bookName of bookNames) {
            const book = await BookModel.findOne({
                name: bookName.name
            })

            if (book) {
                user.orders.push({book})
                await user.save()
            }
        }
        response.send({Message: 'You successfully purchased the books.'})
    } catch (e) {
        response.status(500).send(e)
    }
})

router.get('/user/myOrders/:email', async (request, response) => {
    const email = request.params.email

    try {
        if (!email) {
            return response.status(400).send({Message: 'Please provide an email.'})
        }

        const user = await UserModel.findOne({email: email})

        if (!user) {
            return response.status(404).send({Message: 'User not found.'})
        }

        let myOrders = []
        if (user.orders && user.orders.length > 0) {
            for (let order of user.orders) {
                const book = await BookModel.findOne({_id: order.book})
                myOrders.push(book)
            }
        }

        response.send({OrderHistory: myOrders})
    } catch (e) {
        response.status(500).send(e)
    }
})

export default router
