import { Container, Input, Summary } from "@components"
import { withAuthentication } from "@services"
import Link from "next/link"
import { useState } from "react"

interface Props {}

export default function Message({}: Props) {
  const [date, setDate] = useState({ start: "", end: "" })

  function handleChange(string: string) {
    return function (event: React.ChangeEvent<HTMLInputElement>) {
      setDate((prevState) => ({
        ...prevState,
        [string]: event.target.value,
      }))
    }
  }

  return (
    <Container>
      <Link href="/dashboard">{`<- Back to Dashboard`}</Link>
      <h1>Message</h1>
      <Summary info="Add a custom message to display" />
      <Input type="date" onChange={handleChange("start")} />
      {date.start && (
        <Input type="date" onChange={handleChange("end")} min={date.start} />
      )}

      {date.start && date.end && (
        <div>{`start is on ${new Date(date.start)} and end is on ${new Date(
          date.end
        )}`}</div>
      )}
    </Container>
  )
}

export const getServerSideProps = withAuthentication(({ query }, user) => {
  return {
    props: {
      user,
    },
  }
})
