import mongoose from "mongoose"
import request from "supertest"
import server from "../app"
import UserModel from "../db/models/users.js"
import dotenv from "dotenv"
dotenv.config()

beforeAll(async () => {
    await mongoose.disconnect()
    await mongoose.connect(process.env.MONGODB_URI_TEST)
})
afterAll(async () => await mongoose.disconnect())

describe("POST /api/user/registerUser", () => {
    it("should create a new user", async () => {
        const response = await request(server).post("/api/user/registerUser").send({
            email: 'firsttest@test.com',
            password: '12345678',
            firstName: 'firstname',
            lastName: 'lastname',
            orders: []
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.email).toBe('firsttest@test.com')
        await UserModel.findOneAndDelete( {email: 'firsttest@test.com'} )
    })
})

describe("POST /api/user/registerUser", () => {
    it("should not create a new user when an existing email given for user creation", async () => {
        const response = await request(server).post("/api/user/registerUser").send({
            email: 'test@test.com',
            password: '12345678',
            firstName: 'firstname',
            lastName: 'lastname',
            orders: []
        })
        expect(response.statusCode).toBe(500)
        // Duplicate key error, document already exists
        expect(response.body.code).toBe(11000)
    })
})

describe("POST /api/user/makeOrder", () => {
    it("should not create an order because no books provided", async () => {
        const response = await request(server).post("/api/user/makeOrder").send({
            email: 'abcd@test.com',
            bookNames: []
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.Message).toBe('No books provided for purchase...')
    })
})

describe("POST /api/user/makeOrder", () => {
    it("should not create an order because no email provided", async () => {
        const response = await request(server).post("/api/user/makeOrder").send({
            email: '',
            bookNames: [{"name":"Last Tales"}]
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.Message).toBe('Please provide an email.')
    })
})

describe("POST /api/user/makeOrder", () => {
    it("should not create an order because given email is not matched to any user in database", async () => {
        const response = await request(server).post("/api/user/makeOrder").send({
            email: 'xyz@test.com',
            bookNames: [{"name":"Last Tales"}]
        })
        expect(response.statusCode).toBe(404)
        expect(response.body.Message).toBe('User not found.')
    })
})

describe("POST /api/user/makeOrder", () => {
    it("should create an order with given books", async () => {
        const response = await request(server).post("/api/user/makeOrder").send({
            email: 'abcd@test.com',
            bookNames: [
                {"name":"Last Tales"},
                {"name":"Atomic Habits"}
            ]
        })
        const user = await UserModel.findOne( {email: 'abcd@test.com'} )
        expect(response.statusCode).toBe(200)
        expect(user.orders).toHaveLength(2)
        user.orders = []
        await user.save()
    })
})

describe("POST /api/user/makeOrder", () => {
    it("should create an order with only existing books in our store", async () => {
        const response = await request(server).post("/api/user/makeOrder").send({
            email: 'abcd@test.com',
            bookNames: [
                {"name":"Last Tales"},
                {"name":"Some Habits"},
                {"name":"test book"}
            ]
        })
        const user = await UserModel.findOne( {email: 'abcd@test.com'} )
        expect(response.statusCode).toBe(200)
        expect(user.orders).toHaveLength(1)
        user.orders = []
        await user.save()
    })
})

describe("GET /api/user/myOrders/:email", () => {
    it("should list order history of the given user", async () => {
        const response = await request(server).get("/api/user/myOrders/test@test.com")
        expect(response.statusCode).toBe(200)
        expect(response.body.OrderHistory).toHaveLength(3)
    })
})

describe("GET /api/user/myOrders/:email", () => {
    it("should give an error because no user exists with given email", async () => {
        const response = await request(server).get("/api/user/myOrders/nosuchuser")
        expect(response.statusCode).toBe(404)
    })
})

server.close()
