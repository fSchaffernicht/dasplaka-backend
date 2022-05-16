import styles from "./Container.module.css"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function Container({ children, ...rest }: Props) {
  return (
    <div className={styles.container} {...rest}>
      {children}
    </div>
  )
}
