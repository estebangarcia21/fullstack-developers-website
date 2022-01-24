import { ContentContainer } from 'components/ContentContainer';
import { DashboardWeekResource } from 'components/DashboardWeek';
import Head from 'next/head';
import styles from 'styles/pages/Dashboard.module.scss';

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <main className={styles.container}>
        {/* <DashboardNavbar /> */}

        <header className={styles.header}>
          <ContentContainer>
            <h3>Resources</h3>
            <h1>Practice & review</h1>
          </ContentContainer>
        </header>

        <div>
          <div className={styles.skew} />

          <ContentContainer>
            <div className={styles.assignments}>
              <DashboardWeekResource
                week={2}
                resources={[
                  {
                    name: 'Course outline',
                    type: 'Reading',
                  },
                  {
                    name: 'Introduction video',
                    type: 'Video',
                  },
                ]}
              />
              <DashboardWeekResource
                week={1}
                resources={[
                  {
                    name: 'Course outline',
                    type: 'Reading',
                  },
                  {
                    name: 'Introduction video',
                    type: 'Video',
                  },
                ]}
              />
            </div>
          </ContentContainer>
        </div>
      </main>
    </div>
  );
}
