import styles from "./Loader.module.css"

interface Props {
  isLoading: boolean
  text?: string
}

export default function Loader({ isLoading, text = "Loading" }: Props) {
  if (!isLoading) return null
  return <div className={styles.loader}>{text}</div>
}
