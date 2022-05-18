import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import bcrypt from "bcryptjs"
import { client } from "@services"
import { SESSION_TIME } from "@constants"

const jwtKey = process.env.JWT_SECRET ?? ""

type Data = {
  user?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { body } = req

    const connection = await client

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
          expiresIn: SESSION_TIME,
        })

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", String(token), {
            path: "/", // path needs to be set in order to persist cookie
            maxAge: SESSION_TIME * 1000,
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
          })
        )

        const user = jwt.verify(token, jwtKey)

        res.status(200).json({ user })
      } else {
        res.status(401).json({ error: "User or password is not correct" })
      }
    } else {
      res.status(401).json({ error: "User or password is not correct" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong" })
  }
}
