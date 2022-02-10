import { ContentContainer } from 'components/ContentContainer';
import {
  DashboardWeeklyView,
  DashboardWeeklyViewProps,
} from 'components/dashboard/DashboardWeeklyView';
import Head from 'next/head';
import styles from 'styles/pages/Dashboard.module.scss';

const STATIC_VIEWS: DashboardWeeklyViewProps[] = [
  { resources: [], week: 1 },
  { resources: [], week: 2 },
];

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <nav className={styles.navbar}>
        <ContentContainer>
          <ul className={styles.links}></ul>
        </ContentContainer>
      </nav>

      <main>
        {STATIC_VIEWS.map((view) => (
          <DashboardWeeklyView {...view} key={view.week} />
        ))}
      </main>
    </div>
  );
}
