import { Label } from "@components"
import styles from "./Textarea.module.css"

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  label?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function Textarea({ onChange, label, ...rest }: Props) {
  const textarea = (
    <textarea className={styles.textarea} onChange={onChange} {...rest} />
  )

  if (label) {
    return (
      <>
        <Label>{label}</Label>
        {textarea}
      </>
    )
  }
  return textarea
}
