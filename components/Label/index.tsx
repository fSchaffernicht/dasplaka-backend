import styles from "./Label.module.css"

interface Props extends React.HTMLProps<HTMLLabelElement> {
  children: React.ReactNode
}

export default function Input({ children, ...rest }: Props) {
  return (
    <label className={styles.label} {...rest}>
      {children}
    </label>
  )
}
