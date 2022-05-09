import { ContentContainer } from 'components/ContentContainer';
import styles from 'styles/pages/Join.module.scss';

export const MEETING_WEEK_DAY = 'Monday';
export const MEETING_START_TIME = '3:15pm';
export const MEETING_END_TIME = '4:15pm';

export default function JoinPage() {
  return (
    <div className={styles.container}>
      <main>
        <ContentContainer>
          <h1 className={styles.title}>Join the club</h1>
          <p className={styles.subtitle}>
            Join our community by joining our discord or attending club
            meetings.
            <br />
            <br />
            <span className={styles.meetingText}>
              We meet every {MEETING_WEEK_DAY} from {MEETING_START_TIME} to{' '}
              {MEETING_END_TIME}.
            </span>
          </p>

          <div className={styles.buttons}>
            <a
              href="https://discord.com"
              rel="noopener noreferrer"
              className={styles.discordButton}
            >
              Join the discord
            </a>
          </div>
        </ContentContainer>
      </main>
    </div>
  );
}
