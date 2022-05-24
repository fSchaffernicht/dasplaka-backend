import type { NextApiRequest, NextApiResponse } from "next"
import { Response, RESPONSE } from "@types"
import { client } from "@services"

const buildHookURI = process.env.BUILD_HOOK ?? ""

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const connection = await client

    const db = connection.db("user")
    const message = db.collection("info")

    await message.updateOne({}, { $set: { lastDeploy: new Date().toString() } })

    // const response = await fetch(buildHookURI, {
    //   method: "POST",
    //   body: JSON.stringify({}),
    // })

    res.status(200).json([RESPONSE.SUCCESS, "Build has started"])
    // if (response.status === 200) {
    // } else {
    //   res.status(response.status).json([RESPONSE.ERROR, "Something went wrong"])
    // }
  } catch (error) {
    res.status(500).json([RESPONSE.ERROR, "Something went wrong"])
  }
}
