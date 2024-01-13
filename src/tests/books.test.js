import mongoose from "mongoose"
import request from "supertest"
import server from "../app"
import dotenv from "dotenv"
dotenv.config()

beforeAll(async () => {
    await mongoose.disconnect()
    await mongoose.connect(process.env.MONGODB_URI_TEST)
})
afterAll(async () => await mongoose.disconnect())

describe("GET /api/books", () => {
    it("should return all books", async () => {
        const response = await request(server).get("/api/books")
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
})

server.close()
