import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"
import { ObjectId } from "mongodb"

type Data = {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { body } = req

    const connection = await client

    const db = connection.db("food")
    const recipe = db.collection("recipe")

    const { _id, ...rest } = body

    const updateDoc = {
      $set: { ...rest },
    }

    await recipe.updateOne({ _id: new ObjectId(body._id) }, updateDoc)

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" })
  }
}
