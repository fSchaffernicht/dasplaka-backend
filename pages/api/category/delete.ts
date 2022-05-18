import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"
import { ObjectId } from "mongodb"

type Data = {
  success: boolean
  error?: string
}

// TODO: Delete all foods belonging to category

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { body } = req

    const connection = await client

    const db = connection.db("food")
    const category = db.collection("group")
    const food = db.collection("recipe")

    const { id, group } = body

    const deleted = await category.deleteOne({ _id: new ObjectId(id) })

    // Get all foods belonging to category and delete them
    await food.deleteMany({ group: Number(group) })

    if (deleted) {
      res.status(200).json({ success: true })
    } else {
      res.status(404).json({ success: false })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" })
  }
}
