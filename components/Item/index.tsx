import { Badge } from "@components"
import styles from "./Item.module.css"

interface Props {
  title: string
  description: string
  price: number
  isAvailable: boolean
  onClick: () => void
}

export default function Item({
  title,
  description,
  price,
  isAvailable,
  onClick,
}: Props) {
  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.container}>
        <div>{title}</div>
        <Badge isActive={isAvailable} />
      </div>
      <div className={styles.container}>
        <div className={styles.description}>{description}</div>
        <div className={styles.price}>{price} EUR</div>
      </div>
    </div>
  )
}
