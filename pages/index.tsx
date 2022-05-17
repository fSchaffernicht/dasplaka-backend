import { FormEvent, useState } from "react"
import { Input, Button, Container } from "@components"
import type { NextPage } from "next"
import Head from "next/head"
import Router from "next/router"

const Home: NextPage = () => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    async function send() {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      })
      const result = await response.json()

      if (result.name) Router.push("/dashboard")
      else if (result.error) setError(result.error)
      else setError("Something went wrong")
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
          >
            submit
          </Button>
        </form>
      </Container>
      {error && JSON.stringify(error)}
    </>
  )
}

export default Home
