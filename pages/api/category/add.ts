import type { NextApiRequest, NextApiResponse } from "next"
import { client } from "@services"

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
    const categories = db.collection("categories")

    const [highest] = await categories
      .find()
      .sort("groupId", -1)
      .limit(1)
      .toArray()

    await categories.insertOne({
      ...body,
      groupId: highest.groupId + 1,
      order: -1,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" })
  }
}
