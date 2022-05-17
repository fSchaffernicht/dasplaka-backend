import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import bcrypt from "bcryptjs"
import { client } from "@services"

const jwtKey = process.env.JWT_SECRET ?? ""
const jwtExpirySeconds = 300

type Data = {
  user: any
  success?: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, cookies } = req
  const token = cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }

  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  const newToken = jwt.sign({ user: body.user }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  })

  console.log("new token", newToken)

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", String(newToken), {
      path: "/", // path needs to be set in order to persist cookie
      maxAge: jwtExpirySeconds * 1000,
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
    })
  )

  const user = jwt.verify(newToken, jwtKey)

  res.status(200).json({ user })
}
