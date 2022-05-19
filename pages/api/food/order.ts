import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"
import { ObjectId } from "mongodb"
import { Food } from "@types"

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
    const foods = db.collection("foods")

    const { items } = body

    await Promise.all(
      items.map(async (item: Food) => {
        const updateDoc = {
          $set: { order: item.order },
        }

        await foods.updateOne({ _id: new ObjectId(item._id) }, updateDoc)
      })
    )

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" })
  }
}
