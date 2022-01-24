import { AiFillCrown } from '@react-icons/all-files/ai/AiFillCrown';
import { BiIdCard } from '@react-icons/all-files/bi/BiIdCard';
import { ContentContainer } from 'components/ContentContainer';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from 'styles/pages/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Franklin Computer Science</title>
        <meta name="description" content="Franklin Computer Science" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={styles.navbar}>
        <ContentContainer>
          <div className={styles.content}>
            <AiFillCrown className={styles.crownIcon} />
          </div>
        </ContentContainer>
      </nav>

      <main className={styles.container}>
        <ContentContainer>
          <header className={styles.header}>
            <h3>Franklin High School</h3>
            <h1>Full Stack Developers</h1>

            <p className={styles.description}>
              Learn how to become a software engineer with no previous
              experience.
            </p>

            <button className={styles.joinButton}>Become a member</button>
          </header>

          <section className={styles.overview}>
            <div className={styles.titleContainer}>
              <BiIdCard className={styles.icon} />
              <h1>Web Design</h1>
            </div>
          </section>
        </ContentContainer>
      </main>
    </div>
  );
};

export default Home;
