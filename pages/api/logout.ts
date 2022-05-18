import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import { SESSION_TIME } from "@constants"

const jwtKey = process.env.JWT_SECRET ?? ""

type Data = {
  user: null
  success?: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { cookies } = req
  const token = cookies.token

  if (!token) {
    return res.status(401).end()
  }

  try {
    jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }

  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  const newToken = jwt.sign({}, jwtKey, {
    algorithm: "HS256",
    expiresIn: SESSION_TIME,
  })

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", String(newToken), {
      path: "/", // path needs to be set in order to persist cookie
      maxAge: -1,
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
    })
  )

  res.status(200).json({ success: true, user: null })
}
