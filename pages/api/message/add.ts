import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"
import { ObjectId } from "mongodb"
import { RESPONSE, Response } from "@types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const { body } = req

    const connection = await client

    const db = connection.db("food")
    const message = db.collection("message")

    const foundMessage = await message.findOne()

    if (!foundMessage) {
      const { _id, ...rest } = body
      const insertedDoc = await message.insertOne(rest)

      if (insertedDoc.acknowledged) {
        res
          .status(200)
          .json([RESPONSE.SUCCESS, "Saved new message successfully"])
      } else {
        res.status(400).json([RESPONSE.ERROR, "Could not update message"])
      }
    } else {
      const { _id, ...rest } = body

      const updateDoc = {
        $set: { ...rest },
      }

      await message.updateOne({ _id: new ObjectId(body._id) }, updateDoc)
      res.status(200).json([RESPONSE.SUCCESS, "Updated message successfully"])
    }
  } catch (error) {
    res.status(500).json([RESPONSE.ERROR, "Something went wrong"])
  }
}
