import { Reorder } from "framer-motion"
import jwt from "jsonwebtoken"
import { useEffect, useRef, useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Box, Modal, Summary } from "@components"
import { useRouter } from "next/router"
import { Group } from "@types"
import { NEW } from "@constants"
import isEqual from "lodash.isequal"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import styles from "./Dashboard.module.css"

interface Props {
  user: jwt.JwtPayload
  groups: Group[]
}

export default function Dashboard({ user }: Props) {
  const [triggerBuild, setTriggerBuild] = useState(false)
  const router = useRouter()

  function deploy() {
    // after promise resolve setTriggerBuild = false
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
          text="Trigger build to see latest database changes on dasplaka.de"
        />

        <Box title="Logout" onClick={console.log} />
        <Modal isVisible={triggerBuild}>
          <Container>
            <h1>Are you done with all of your changes?</h1>
            <p>
              This action will trigger a new build for dasplaka.de. It can take
              a couple of minutes before you see your changes live. Grab a
              coffee!
            </p>
            <Button isFullWidth onClick={() => setTriggerBuild(false)}>
              No
            </Button>
            <Button isFullWidth onClick={deploy}>
              Deploy now
            </Button>
          </Container>
        </Modal>
      </div>
    </Container>
  )
}

export const getServerSideProps = withAuthentication(async (context, user) => {
  try {
    return {
      props: {
        user,
      },
    }
  } catch (e) {
    console.log(e)
  }
})
