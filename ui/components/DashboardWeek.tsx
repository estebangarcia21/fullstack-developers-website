import styles from './DashboardWeek.module.scss';
import { AiOutlineVideoCamera } from '@react-icons/all-files/ai/AiOutlineVideoCamera';
import { IoMdSpeedometer } from '@react-icons/all-files/io/IoMdSpeedometer';
import { IconType } from '@react-icons/all-files/lib';
import { BiCode } from '@react-icons/all-files/bi/BiCode';
import { AiOutlineBook } from '@react-icons/all-files/ai/AiOutlineBook';

export interface Resource {
  name: string;
  type: 'Video' | 'Reading' | 'Quiz' | 'Code test';
}

const RESOURCE_ICON_MAP: { [key in Resource['type']]: IconType } = {
  Video: AiOutlineVideoCamera,
  Reading: AiOutlineBook,
  'Code test': BiCode,
  Quiz: IoMdSpeedometer,
};

export interface DashboardWeekResourceProps {
  week: number;
  resources: Resource[];
}

export function DashboardWeekResource({
  resources,
  week,
}: DashboardWeekResourceProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Week {week}</h1>
      </header>

      <ul className={styles.resourceList}>
        {resources.map(({ name, type }) => {
          const Icon = RESOURCE_ICON_MAP[type];

          return (
            <div className={styles.resource} key={name}>
              <Icon className={styles.icon} />

              <h2 className={styles.text}>{name}</h2>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
