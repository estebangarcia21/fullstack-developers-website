import { GiHamburgerMenu } from '@react-icons/all-files/gi/GiHamburgerMenu';
import { ContentContainer } from './ContentContainer';
import styles from './Navbar.module.scss';

export function Navbar() {
  return (
    <ContentContainer>
      <nav className={styles.container}>
        <GiHamburgerMenu className={styles.menuIcon} />
      </nav>
    </ContentContainer>
  );
}
