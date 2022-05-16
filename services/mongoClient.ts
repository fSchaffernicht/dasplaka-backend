import { MongoClient } from "mongodb"

const options = {}

let client: MongoClient

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

client = new MongoClient(process.env.MONGODB_URI, options)

export default client
