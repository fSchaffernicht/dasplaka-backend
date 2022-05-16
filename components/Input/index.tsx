import { Label } from "@components"
import styles from "./Input.module.css"
import classNames from "classnames"

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ onChange, label, ...rest }: Props) {
  const classes = classNames(styles.input, {
    [styles.checkbox]: rest.type === "checkbox",
  })

  const input = <input className={classes} onChange={onChange} {...rest} />

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
