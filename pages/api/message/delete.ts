import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"
import { ObjectId } from "mongodb"
import { Response, RESPONSE } from "@types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { body } = req

    const connection = await client

    const db = connection.db("food")
    const message = db.collection("message")

    const { id } = body
    const deleted = await message.deleteOne({ _id: new ObjectId(id) })

    if (deleted.deletedCount > 0) {
      res.status(200).json([RESPONSE.SUCCESS, "Deleted message successfully"])
    } else {
      res.status(404).json([RESPONSE.ERROR, "Could not delete message"])
    }
  } catch (error) {
    res.status(500).json([RESPONSE.ERROR, "Something went wrong"])
  }
}
