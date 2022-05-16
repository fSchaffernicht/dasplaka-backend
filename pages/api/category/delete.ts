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
    const recipe = db.collection("group")

    const { id } = body
    const deleted = await recipe.deleteOne({ _id: new ObjectId(id) })

    if (deleted) {
      res.status(200).json({ success: true })
    } else {
      res.status(404).json({ success: false })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" })
  }
}
