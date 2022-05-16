import jwt from "jsonwebtoken"
import React, { useState } from "react"
import { client, withAuthentication } from "@services"
import { Button, Container, Item } from "@components"
import { useRouter } from "next/router"
import { Food, Group } from "@types"
import groupBy from "lodash.groupby"
import { FOOD } from "@constants"

interface Props {
  user: jwt.JwtPayload
  foods: Food[]
  groups: Group[]
}

export default function Dashboard({ foods, groups }: Props) {
  const router = useRouter()
  const groupedFoods = groupBy(foods, "group")

  return (
    <Container>
      <h1>Dashboard</h1>
      {Object.entries(groupedFoods).map(([key, values]) => (
        <div key={key}>
          <div>
            {groups.find((x) => x.groupId.toString() === key)?.title}
            <div style={{ marginBottom: "1rem" }}></div>
          </div>
          {values.map((food) => {
            return (
              <Item
                key={food._id}
                title={food.title}
                description={food.description}
                price={food.price}
                isAvailable={food.isAvailable}
                onClick={() =>
                  router.push({
                    pathname: "dashboard/[food]",
                    query: { food: food.title },
                  })
                }
              />
            )
          })}
          <Button
            onClick={() =>
              router.push({
                pathname: "dashboard/[food]",
                query: { food: FOOD.NEW, group: key },
              })
            }
          >
            + Add new entry
          </Button>
          <div style={{ marginBottom: "3rem" }}></div>
        </div>
      ))}
    </Container>
  )
}

export const getServerSideProps = withAuthentication(async ({ req }, user) => {
  try {
    const connection = await client.connect()

    const db = connection.db("food")
    const group = db.collection("group")
    const food = db.collection("recipe")

    const groups = await group.find().toArray()
    const foods = await food.find().toArray()

    return {
      props: {
        user,
        groups: JSON.parse(JSON.stringify(groups)),
        foods: JSON.parse(JSON.stringify(foods)),
      },
    }
  } catch (e) {
    console.log(e)
  }
})
