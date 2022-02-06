import { ContentContainer } from './ContentContainer';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.container}>
      <ContentContainer>
        <h1 className={styles.title}>{'>'} Fullstack Developers</h1>
        <p className={styles.copyrightNotice}>
          <span>&copy;</span> Esteban Garcia 2022
        </p>
      </ContentContainer>
    </footer>
  );
}
