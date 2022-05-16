import { Reorder } from "framer-motion"
import jwt from "jsonwebtoken"
import { useEffect, useRef, useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Item } from "@components"
import { useRouter } from "next/router"
import { Group } from "@types"
import { NEW } from "@constants"
import isEqual from "lodash.isequal"
import { motion, AnimatePresence } from "framer-motion"

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
      <h1>Categories</h1>
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((group) => {
          return (
            <Reorder.Item key={group._id} value={group}>
              <Item
                key={group._id}
                title={group.title}
                info={group.info}
                onDetails={() =>
                  router.push({
                    pathname: "dashboard/foods/[slug]",
                    query: { slug: group.groupId },
                  })
                }
                onClick={() =>
                  router.push({
                    pathname: "dashboard/category/[slug]",
                    query: { slug: group.groupId },
                  })
                }
              />
            </Reorder.Item>
          )
        })}
      </Reorder.Group>

      <Button
        isFullWidth
        onClick={() =>
          router.push({
            pathname: "dashboard/category/[slug]",
            query: { slug: NEW.CATEGORY, group: "key" },
          })
        }
      >
        + Add new entry
      </Button>
      <AnimatePresence>
        {changed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button isFullWidth onClick={updateOrder}>
              Update Order
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
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
