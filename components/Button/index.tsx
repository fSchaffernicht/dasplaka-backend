import classNames from "classnames"
import styles from "./Button.module.css"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isFullWidth?: boolean
  white?: boolean
}

export default function Button({
  children,
  isFullWidth = false,
  white,
  ...rest
}: Props) {
  const classes = classNames(styles.button, {
    [styles["full-width"]]: isFullWidth,
    [styles["white"]]: white,
  })

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
