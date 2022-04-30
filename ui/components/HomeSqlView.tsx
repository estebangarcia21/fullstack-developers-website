import { Children } from 'utils/commonTypes';
import styles from './HomeSqlView.module.scss';

export interface HomeSqlViewConfiguration {
  propertySelection: string[];
  table: string;
  output: string;
}

export interface HomeSqlViewProps {
  left: HomeSqlViewConfiguration;
  right: HomeSqlViewConfiguration;
}

export function HomeSqlView({ left, right }: HomeSqlViewProps) {
  return (
    <figure className={styles.container}>
      <div className={styles.content}>
        <SqlView {...left} />
        <SqlView {...right} />
      </div>
    </figure>
  );
}

function SqlView({
  output,
  propertySelection,
  table,
}: HomeSqlViewConfiguration) {
  return (
    <div className={styles.sqlView}>
      <pre>
        <code className={styles.code}>
          <strong>
            mysql{'> '}
            <Statement>SELECT </Statement>
            <Selection>{propertySelection.join(', ')} </Selection>
            <Statement>FROM </Statement>
            <Table>{table}</Table>;
          </strong>
          <br />
          {output}
          <br />
          <Output>Completed in 0.00s</Output>
        </code>
      </pre>
    </div>
  );
}

const TextStyleComponent =
  (className: string) =>
  // eslint-disable-next-line react/display-name
  ({ children }: Children) =>
    <span className={className}>{children}</span>;

const Statement = TextStyleComponent(styles.keyword);
const Selection = TextStyleComponent(styles.selection);
const Table = TextStyleComponent(styles.table);
const Output = TextStyleComponent(styles.output);
