import { Reorder } from "framer-motion"
import jwt from "jsonwebtoken"
import { useEffect, useRef, useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Item } from "@components"
import { useRouter } from "next/router"
import { Food, Group } from "@types"
import { NEW } from "@constants"
import isEqual from "lodash.isequal"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface Props {
  user: jwt.JwtPayload
  foods: Food[]
  group: Group
}

export default function Foods({ foods, group }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(foods)
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
      <Link href="/dashboard">{`<- Back to Dashboard`}</Link>
      <h1>{group?.title}</h1>
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((food) => {
          return (
            <Reorder.Item key={food._id} value={food}>
              <Item
                key={food._id}
                title={food.title}
                description={food.description}
                info={food.info}
                price={food.price}
                isAvailable={food.isAvailable}
                onClick={() =>
                  router.push({
                    pathname: "../food/[slug]",
                    query: { slug: food.title, group: group.groupId },
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
            pathname: "../food/[slug]",
            query: { slug: NEW.FOOD, group: group.groupId },
          })
        }
      >
        + Add new food
      </Button>
      <AnimatePresence>
        {changed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button onClick={updateOrder}>Update order</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

export const getServerSideProps = withAuthentication(
  async ({ query }, user) => {
    const { slug } = query
    try {
      const connection = await client

      const db = connection.db("food")
      const food = db.collection("recipe")
      const group = db.collection("group")

      const foods = await food
        .find({ group: Number(slug) })
        .sort("order", 1)
        .toArray()
      const x = await group.findOne({ groupId: Number(slug) })

      return {
        props: {
          user,
          foods: JSON.parse(JSON.stringify(foods)),
          group: JSON.parse(JSON.stringify(x)),
        },
      }
    } catch (e) {
      console.log(e)
    }
  }
)
