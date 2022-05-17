import { Reorder, useDragControls } from "framer-motion"
import jwt from "jsonwebtoken"
import { useEffect, useRef, useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Item, Summary } from "@components"
import { useRouter } from "next/router"
import { Group } from "@types"
import { NEW } from "@constants"
import isEqual from "lodash.isequal"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface Props {
  user: jwt.JwtPayload
  groups: Group[]
}

export default function Dashboard({ groups }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(groups)
  const itemsRef = useRef(items)
  const [changed, setChanged] = useState(!isEqual(items, itemsRef.current))

  useEffect(() => {
    setChanged(!isEqual(items, itemsRef.current))
    itemsRef.current = items
  }, [items])

  async function updateOrder() {
    try {
      const payload = items.map((x, i) => ({ ...x, order: i }))
      const response = await fetch("/api/category/order", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          items: payload,
        }),
      })
      const { success } = await response.json()
      if (success) {
        itemsRef.current = items
        setChanged(!isEqual(items, itemsRef.current))
      }
    } catch (error) {}
  }

  return (
    <Container>
      <Link href={`/dashboard`}>{`<- Back to dashboard`}</Link>
      <h1>Categories</h1>
      <Summary
        count={items.length}
        info="Use drag and drop to reorder items."
      />
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((group) => {
          return (
            <DragItem
              key={group._id}
              group={group}
              onDetails={() =>
                router.push({
                  pathname: "../foods/[slug]",
                  query: { slug: group.groupId },
                })
              }
              onClick={() =>
                router.push({
                  pathname: "../category/[slug]",
                  query: { slug: group.groupId },
                })
              }
            />
          )
        })}
      </Reorder.Group>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() =>
            router.push({
              pathname: "../category/[slug]",
              query: { slug: NEW.CATEGORY, group: "key" },
            })
          }
        >
          Add new entry
        </Button>
        <AnimatePresence>
          {changed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button onClick={updateOrder}>Update Order</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  )
}

function DragItem({
  group,
  onClick,
  onDetails,
}: {
  group: Group
  onClick: () => void
  onDetails: () => void
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      key={group._id}
      value={group}
      dragListener={false}
      dragControls={controls}
    >
      <Item
        onPointerDown={(e) => controls.start(e)}
        key={group._id}
        title={group.title}
        info={group.info}
        onDetails={onDetails}
        onClick={onClick}
      />
    </Reorder.Item>
  )
}

export const getServerSideProps = withAuthentication(async ({ req }, user) => {
  try {
    const connection = await client

    const db = connection.db("food")
    const group = db.collection("group")

    const groups = await group.find().sort("order", 1).toArray()

    return {
      props: {
        user,
        groups: JSON.parse(JSON.stringify(groups)),
      },
    }
  } catch (e) {
    console.log(e)
  }
})
