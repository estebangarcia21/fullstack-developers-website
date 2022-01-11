import styles from './ContentContainer.module.scss'

export interface ContentContainerProps {
  children: React.ReactNode
}

export function ContentContainer({ children }: ContentContainerProps) {
  return <div className={styles.container}>{children}</div>
}
