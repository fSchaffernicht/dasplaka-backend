import { GetServerSidePropsContext } from "next"
import cookie from "cookie"
import jwt from "jsonwebtoken"

type User = string | jwt.JwtPayload | undefined

export default function withAuthentication(
  gssp: (c: GetServerSidePropsContext, user: User) => void
) {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context
    const cookies = cookie.parse(req.headers.cookie || "")
    const { token } = cookies

    const key = process.env.JWT_SECRET
    if (!key) throw new Error("process.env.JWT_SECRET not provided")

    let user
    try {
      user = jwt.verify(token, key)
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
        }
      }

      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      }
    }

    return await gssp(context, user)
  }
}
