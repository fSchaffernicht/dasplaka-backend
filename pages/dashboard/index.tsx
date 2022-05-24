import { useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Box, Modal, Alert } from "@components"
import { useRouter } from "next/router"

import styles from "./Dashboard.module.css"
import { Response } from "@types"

interface Props {
  lastDeploy: string
}

export default function Dashboard({ lastDeploy }: Props) {
  const [result, setResult] = useState<Response>()
  const [triggerBuild, setTriggerBuild] = useState(false)
  const router = useRouter()

  async function deploy() {
    try {
      const response = await fetch("/api/build")
      const result = await response.json()
      setResult(result)
      setTriggerBuild(false)
    } catch (error) {}
  }

  async function logout() {
    try {
      const response = await fetch("/api/logout")
      const { success } = await response.json()
      if (success) {
        router.push("/")
      }
    } catch (error) {}
  }

  return (
    <Container>
      <h1>Dashboard</h1>

      <div className={styles.grid}>
        <Box
          onClick={() => router.push("../categories")}
          title="Categories"
          text="Sort, edit, delete or add new categories or foods"
        />
        <Box
          onClick={() => router.push("../message")}
          title="Custom message"
          text="Create a custom message with a fixed time period"
        />
        <Box
          onClick={() => setTriggerBuild(true)}
          title="Deploy"
          text="Trigger build to see latest database changes on dasplaka.de."
        />

        <Box title="Logout" onClick={logout} />

        <Modal isVisible={triggerBuild}>
          <Container>
            <h1>Are you done with all of your changes?</h1>
            <p>
              This action will trigger a new build for dasplaka.de. It can take
              a couple of minutes before you see your changes live. Grab a
              coffee!
            </p>
            <Button isFullWidth onClick={deploy}>
              Deploy now
            </Button>
            <Button isFullWidth onClick={() => setTriggerBuild(false)}>
              No
            </Button>
          </Container>
        </Modal>
      </div>
      <div style={{ marginTop: "1rem" }}>
        {result && <Alert type={result[0]} text={result[1]} />}
        {lastDeploy.length > 0 && (
          <Alert text={`Last deploy: ${lastDeploy ?? ""}`} />
        )}
      </div>
    </Container>
  )
}

export const getServerSideProps = withAuthentication(async (context, user) => {
  try {
    const connection = await client

    const db = connection.db("user")
    const infoDocument = db.collection("info")

    const info = await infoDocument.findOne()

    let lastDeploy = ""

    if (info?._id) {
      const tempDate = new Date(info.lastDeploy)
      lastDeploy = `${tempDate.toLocaleDateString()} - ${tempDate.toLocaleTimeString()}`
    }

    return {
      props: {
        user,
        lastDeploy,
      },
    }
  } catch (e) {
    console.log(e)
  }
})
