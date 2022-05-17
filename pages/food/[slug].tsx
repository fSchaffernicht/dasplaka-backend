import { useState } from "react"
import { Button, Container, Input, Modal, Textarea } from "@components"
import { client, withAuthentication } from "@services"
import { Food as FoodType } from "@types"
import Link from "next/link"
import { NEW } from "@constants"
import { useRouter } from "next/router"

interface Props {
  food: FoodType
  isNew: boolean
  group: number
}

export default function Food({ food, isNew, group }: Props) {
  const [value, setValue] = useState<FoodType>(food)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { query, push } = useRouter()

  function handleChange(key: string) {
    return function (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      setValue((prevState) => ({
        ...prevState,
        [key]:
          event.target.type === "checkbox" && "checked" in event.target
            ? event.target?.checked
            : event.target.value,
      }))
    }
  }

  async function update() {
    try {
      const response = await fetch("/api/food/update", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...value }),
      })
      const { success } = await response.json()
      if (success) push(`/foods/${group}`)
    } catch (error) {}
  }

  async function save() {
    const payload: FoodType = {
      group: Number(query.group),
      title: value.title,
      description: value.description,
      isAvailable: Boolean(value.isAvailable),
      price: Number(value.price),
      order: Number(query.newOrder),
      info: value.info ?? "",
    }

    try {
      const response = await fetch("/api/food/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...payload }),
      })
      const { success } = await response.json()
      if (success) push(`/foods/${group}`)
    } catch (error) {}
  }

  async function deleteFood(id?: string) {
    if (!confirmDelete) return
    if (!id) return
    try {
      const response = await fetch("/api/food/delete", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      const { success } = await response.json()
      if (success) push(`/foods/${group}`)
    } catch (error) {}
  }

  const isValid = value.title && value.price

  return (
    <Container>
      <Link href={`/foods/${group}`}>{`<- Back to foods`}</Link>
      <div style={{ marginBottom: "4rem" }} />
      <Input
        label="title"
        type="text"
        value={value.title}
        onChange={handleChange("title")}
      />
      <Textarea
        rows={5}
        label="description"
        value={value.description}
        onChange={handleChange("description")}
      />
      <Input
        label="price"
        type="number"
        value={value.price}
        onChange={handleChange("price")}
      />
      <Textarea
        rows={2}
        label="info"
        value={value.info}
        onChange={handleChange("info")}
      />
      <div>
        <Input
          label="is available"
          type="checkbox"
          checked={value.isAvailable}
          onChange={handleChange("isAvailable")}
        />
      </div>
      <div>
        {isNew ? (
          <Button isFullWidth disabled={!isValid} onClick={save}>
            Save
          </Button>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => setConfirmDelete(true)}>Delete</Button>
            <Button onClick={update}>Update</Button>
          </div>
        )}
      </div>
      <Modal isVisible={confirmDelete}>
        <Container>
          <h1>Are you sure?</h1>
          <p>This action will remove the item completely.</p>
          <Button isFullWidth onClick={() => setConfirmDelete(false)}>
            No
          </Button>
          <Button isFullWidth onClick={() => deleteFood(food._id)}>
            Yes
          </Button>
        </Container>
      </Modal>
    </Container>
  )
}

export const getServerSideProps = withAuthentication(
  async ({ query }, user) => {
    const { slug, group } = query

    if (slug === NEW.FOOD) {
      return {
        props: {
          group: group,
          isNew: true,
          food: {
            description: "",
            title: "",
            price: "",
            isAvailable: true,
          },
        },
      }
    }

    try {
      const connection = await client

      const db = connection.db("food")
      const recipe = db.collection("recipe")

      const x = await recipe.findOne({ title: slug })

      return {
        props: {
          user,
          group: group,
          food: JSON.parse(JSON.stringify(x)),
        },
      }
    } catch (e) {
      console.log(e)
    }
  }
)
