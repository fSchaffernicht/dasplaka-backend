import { Label } from "@components"
import styles from "./Input.module.css"

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ onChange, label, ...rest }: Props) {
  const input = <input className={styles.input} onChange={onChange} {...rest} />

  if (label) {
    return (
      <>
        <Label>{label}</Label>
        {input}
      </>
    )
  }
  return input
}
