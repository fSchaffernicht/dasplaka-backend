import { Alert, Button, Container, Input, Summary, Textarea } from "@components"
import { client, withAuthentication } from "@services"
import { Response } from "@types"
import Link from "next/link"
import { useState } from "react"

type Message = {
  message: string
  start: string
  end: string
  _id: string
}
interface Props {
  message: Message
}

export default function Message({ message }: Props) {
  const [response, setResponse] = useState<Response>()
  const [{ value, start, end }, setState] = useState({
    value: message?.message ?? "",
    start: message?.start ?? "",
    end: message?.end ?? "",
  })

  function handleChange(string: string) {
    return function (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      setState((prevState) => ({
        ...prevState,
        [string]: event.target.value,
      }))
    }
  }

  async function save() {
    const payload = {
      message: value,
      start,
      end,
      _id: message?._id,
    }
    try {
      const response = await fetch("/api/message/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      setResponse(result)
    } catch (error) {}
  }

  async function onDelete() {
    try {
      const response = await fetch("/api/message/delete", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id: message._id }),
      })

      const result = await response.json()
      setResponse(result)
      if (result[0] === "success") {
        setState({ value: "", start: "", end: "" })
      }
    } catch (error) {}
  }

  return (
    <Container>
      <Link href="/dashboard">{`<- Back to Dashboard`}</Link>
      <h1>Custom message</h1>
      <p>
        Configure a custom message which will be displayed on dasplaka.de within
        a specific time range.
      </p>
      <Textarea
        label="custom message"
        rows={5}
        value={value}
        onChange={handleChange("value")}
      />
      <hr />
      <div>
        <h3>Choose a duration</h3>
        <Input
          label="start date"
          type="date"
          value={start}
          onChange={handleChange("start")}
        />
        <Input
          label="end date"
          type="date"
          disabled={!start}
          value={end}
          onChange={handleChange("end")}
          min={start}
        />

        {start && end && (
          <div style={{ marginBottom: "1rem" }}>
            <p>This message will be shown within this time range:</p>
            <div>
              <span>{new Date(start).toDateString()} - </span>
              <span>{new Date(end).toDateString()}</span>
            </div>
          </div>
        )}
      </div>

      {value && (
        <>
          <hr />
          <Summary info={value} />
        </>
      )}

      {start && end && value && (
        <>
          <Button isFullWidth onClick={save}>
            {message?._id ? "Update" : "Save"}
          </Button>
          {message?._id && (
            <Button isFullWidth onClick={onDelete}>
              Delete
            </Button>
          )}
        </>
      )}
      {response && <Alert type={response[0]} text={response[1]} />}
    </Container>
  )
}

export const getServerSideProps = withAuthentication(
  async ({ query }, user) => {
    try {
      const connection = await client

      const db = connection.db("food")
      const message = db.collection("message")

      const found = await message.findOne()

      return {
        props: {
          user,
          message: JSON.parse(JSON.stringify(found)),
        },
      }
    } catch (e) {
      console.log(e)
    }
  }
)
