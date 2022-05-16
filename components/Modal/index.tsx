import Container from "components/Container"
import styles from "./Modal.module.css"

interface Props {
  isVisible?: boolean
  children: React.ReactNode
  onClose?: () => void
}

export default function Modal({ children, isVisible, onClose }: Props) {
  if (!isVisible) return null
  return (
    <div className={styles.modal}>
      <Container>
        <div className={styles.background}>{children}</div>
      </Container>
    </div>
  )
}
