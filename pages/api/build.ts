import type { NextApiRequest, NextApiResponse } from "next"
import { Response, RESPONSE } from "@types"

const buildHookURI = process.env.BUILD_HOOK ?? ""

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const response = await fetch(buildHookURI, {
      method: "POST",
      body: JSON.stringify({}),
    })

    if (response.status === 200) {
      res.status(200).json([RESPONSE.SUCCESS, "Build has started"])
    } else {
      res.status(response.status).json([RESPONSE.ERROR, "Something went wrong"])
    }
  } catch (error) {
    res.status(500).json([RESPONSE.ERROR, "Something went wrong"])
  }
}
