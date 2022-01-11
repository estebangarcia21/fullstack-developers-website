import { Children } from 'utils/commonTypes'
import { ContentContainer } from './ContentContainer'
import styles from './IndexSection.module.scss'

export interface IndexSectionProps extends Children {
  name: string
}

export function IndexSection({ name, children }: IndexSectionProps) {
  return (
    <section className={styles.container}>
      <ContentContainer>
        <h1>{name}</h1>

        {children}
      </ContentContainer>
    </section>
  )
}
