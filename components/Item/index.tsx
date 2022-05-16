import { Badge } from "@components"
import Button from "components/Button"
import styles from "./Item.module.css"

interface Props {
  title: string
  description?: string
  info: string
  price?: number
  isAvailable?: boolean
  onClick: () => void
  onDetails?: () => void
}

export default function Item({
  title,
  description,
  info,
  price,
  isAvailable,
  onClick,
  onDetails,
}: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.container}>
        <div>{title}</div>
        {isAvailable !== undefined && <Badge isActive={isAvailable} />}
      </div>
      <div className={styles.container}>
        {description && <div className={styles.description}>{description}</div>}
        <div className={styles.description}>{info}</div>
        {price && <div className={styles.price}>{price} EUR</div>}
      </div>
      <div className={styles["button-container"]}>
        <Button className={styles.button} onClick={onClick}>
          Edit
        </Button>
        {typeof onDetails === "function" && (
          <Button className={styles.button} onClick={onDetails}>
            Details
          </Button>
        )}
      </div>
    </div>
  )
}
