import { FormEvent, useState } from "react"
import { Input, Button, Container, Alert } from "@components"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { push } = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    async function send() {
      setIsLoading(true)

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      })
      const result = await response.json()

      if (result.user) {
        push("/dashboard")
      } else if (result.error) {
        setIsLoading(false)
        setError(result.error)
      } else {
        setIsLoading(false)
        setError("Something went wrong")
      }
    }

    if (name && password) send()
  }

  return (
    <>
      <Head>
        <title>dasplaka backend</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <h1>Login</h1>
        <p>Speak friend and enter!</p>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            name="name"
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            type="password"
            value={password}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            isFullWidth
            disabled={name.length === 0 || password.length === 0}
            type="submit"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
        {error && <Alert type="error" text={error} />}
      </Container>
    </>
  )
}

export default Home
