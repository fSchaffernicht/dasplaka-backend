import classNames from "classnames"
import styles from "./Alert.module.css"

type Alert = "success" | "error" | "info"

interface Props {
  text: string
  type?: Alert
}

export default function Alert({ text, type = "info" }: Props) {
  const classes = classNames(styles.alert, [styles[type]])
  return (
    <div className={classes}>
      <div className={styles["info-block"]}>i</div>
      <div className={styles["text-block"]}>{text}</div>
    </div>
  )
}
