import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import bcrypt from "bcryptjs"
import { client } from "@services"

const jwtKey = process.env.JWT_SECRET ?? ""
const jwtExpirySeconds = 300

type Data = {
  name?: string
  password?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { body } = req

    const connection = await client.connect()

    const db = connection.db("user")
    const admin = db.collection("admin")

    const user = await admin.findOne({ name: body.name })

    if (user) {
      const hash = user.password
      const matched = await bcrypt.compare(body.password, hash)

      if (matched) {
        // Create a new token with the username in the payload
        // and which expires 300 seconds after issue
        const token = jwt.sign({ user: body.name }, jwtKey, {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds,
        })

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", String(token), {
            path: "/", // path needs to be set in order to persist cookie
            maxAge: jwtExpirySeconds * 1000,
          })
        )

        res.status(301).json(JSON.stringify(user) as any)
      } else {
        res.status(401).json({ error: "User or password is not correct" })
      }
    } else {
      res.status(401).json({ error: "User or password is not correct" })
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
}
