import classNames from "classnames"
import styles from "./Button.module.css"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isFullWidth?: boolean
  white?: boolean
  className?: string
}

export default function Button({
  children,
  isFullWidth = false,
  white,
  className,
  ...rest
}: Props) {
  const classes = classNames(
    styles.button,
    {
      [styles["full-width"]]: isFullWidth,
      [styles["white"]]: white,
    },
    className
  )

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
