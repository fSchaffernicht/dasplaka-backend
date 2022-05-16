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

  console.log(">>", food)

  function handleChange(key: string) {
    return function (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
      setValue((prevState) => ({
        ...prevState,
        [key]: key === "isAvailable" ? !event.target.value : event.target.value,
      }))
    }
  }

  async function update() {
    try {
      const response = await fetch("/api/update-category", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...value }),
      })
      const { success } = await response.json()
      if (success) push(`/dashboard`)
    } catch (error) {}
  }

  async function save() {
    const payload = {
      title: value.title,
      info: value.info ?? "",
    }

    try {
      const response = await fetch("/api/add-category", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...payload }),
      })
      const { success } = await response.json()
      if (success) push(`/dashboard`)
    } catch (error) {}
  }

  async function deleteFood(id?: string) {
    if (!confirmDelete) return
    if (!id) return
    try {
      const response = await fetch("/api/delete-category", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      const { success } = await response.json()
      if (success) push(`/dashboard`)
    } catch (error) {}
  }

  const isValid = value.title

  return (
    <Container>
      <Link href={`/dashboard`}>{`<- Back to categories`}</Link>
      <div style={{ marginBottom: "4rem" }} />
      <Input
        label="title"
        type="text"
        value={value.title}
        onChange={handleChange("title")}
      />
      <Textarea
        rows={2}
        label="info"
        value={value.info}
        onChange={handleChange("info")}
      />
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

export const getServerSideProps = withAuthentication(async ({ query }) => {
  const { slug, group } = query

  if (slug === NEW.CATEGORY) {
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
    const recipe = db.collection("group")

    const x = await recipe.findOne({ groupId: Number(slug) })

    console.log("x", x)

    return {
      props: {
        food: JSON.parse(JSON.stringify(x)),
      },
    }
  } catch (e) {
    console.log(e)
  }
})
