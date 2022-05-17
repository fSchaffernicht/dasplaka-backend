import jwt from "jsonwebtoken"
import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import styles from "./Timer.module.css"

interface Props {
  user: jwt.JwtPayload
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export default function Timer({ user = {} }: Props) {
  const router = useRouter()
  const [localUser, setLocalUser] = useState(user)
  const [time, setTime] = useState(300)

  useInterval(
    () => {
      const now = Math.floor(new Date().getTime() / 1000)
      const left = Math.floor(Number(localUser?.exp))
      setTime(left - now)
    },
    localUser ? 1000 : null
  )

  useEffect(() => {
    if (time < 0) router.push("/")
  }, [time, router])

  async function renew() {
    try {
      const response = await fetch("/api/refresh", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
      const { user: userWithNewToken } = await response.json()
      if (userWithNewToken) {
        console.log(userWithNewToken)
        setLocalUser(userWithNewToken)
      }
    } catch (error) {}
  }

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const timeString = {
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds,
  }

  if (time < 60 && time >= 0) {
    return (
      <div className={styles.timer} onClick={renew}>
        {`Yo! Your Token expires in ${timeString.minutes}:${timeString.seconds} seconds. Click to renew!`}
      </div>
    )
  }

  return null
}
