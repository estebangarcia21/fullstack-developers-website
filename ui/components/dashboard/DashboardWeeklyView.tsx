import styles from './DashboardWeeklyView.module.scss';

export interface ApiResource {
  id: string;
  name: string;
}

export interface DashboardWeeklyViewProps {
  week: number;
  resources: unknown[];
}

export function DashboardWeeklyView({
  resources,
  week,
}: DashboardWeeklyViewProps) {
  return (
    <div className={styles.container}>
      <h1>Week {week}</h1>
      <p>Learn about the basics of Javascript.</p>
    </div>
  );
}
