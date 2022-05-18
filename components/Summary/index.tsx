import styles from "./Summary.module.css"

interface Props {
  count?: number
  info: string
}

export default function Summay({ count, info }: Props) {
  return (
    <div className={styles.summary}>
      {!!count && count > 0 && <div>{count} items found</div>}
      <div>
        <small>{info}</small>
      </div>
    </div>
  )
}
