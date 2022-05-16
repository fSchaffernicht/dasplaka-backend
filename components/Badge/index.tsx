import classNames from "classnames"
import styles from "./Badge.module.css"

interface Props {
  isActive: boolean
}

export default function Item({ isActive }: Props) {
  const classes = classNames(styles.badge, {
    [styles.active]: isActive,
  })
  return <div className={classes} />
}
