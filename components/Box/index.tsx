import styles from "./Box.module.css"

interface Props {
  title: string
  text?: string
  onClick: () => void
}

export default function Summay({ title, text, onClick }: Props) {
  return (
    <div onClick={onClick} className={styles.box}>
      <div className={styles.title}>{title}</div>
      <p>{text}</p>
    </div>
  )
}
