import { ContentContainer } from 'components/ContentContainer';
import { Footer } from 'components/Footer';
import { HomeSqlView } from 'components/HomeSqlView';
import { SkewBackground } from 'components/SkewBackground';
import styles from 'styles/Index.module.scss';

export default function Home() {
  return (
    <div>
      <main className={styles.container}>
        <ContentContainer>
          <header className={styles.pageHeader}>
            <h1>Learn Computer Science.</h1>

            <p>
              Learn how to create mobile applications, websites, use databases,
              and more to build real-world applications.
            </p>

            <button className={styles.joinButton}>Become a member</button>
          </header>
        </ContentContainer>

        <ContentContainer noPadding>
          <div className={styles.circleSection}>
            {/* Left Circles */}
            <Circle size={100} coords={[0, 0, 0, 0]} transform={['-55%', 0]} />
            <Circle
              size={150}
              opacity={0.2}
              coords={[0, 50, 0, 0]}
              transform={['-85%', 0]}
            />

            {/* Right Circles */}
            <Circle size={150} coords={[, , 0]} transform={['50%', '-25%']} />
            <Circle
              coords={[, , 0]}
              size={120}
              opacity={0.2}
              transform={['60%', '-65%']}
            />
          </div>
        </ContentContainer>

        <ContentContainer>
          <section className={styles.buildAppsSection}>
            <h3>BUILD THE FUTURE</h3>

            <h1 className={styles.title}>Build mobile apps</h1>

            <p className={styles.description}>
              Leverage the most modern frameworks used in the software
              development industry to build professional-grade mobile apps.{' '}
            </p>

            <div className={styles.exploreContainer}>
              <button className={styles.button}>Explore</button>

              <div className={styles.imgContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Mobile-Vector.svg" alt="" className={styles.img} />
              </div>
            </div>
          </section>
        </ContentContainer>

        <SkewBackground color="#170d42" skewAxis="Y" deg={SKEW_DEG}>
          <Circle
            opacity={0.5}
            color="#5CECDB"
            size={100}
            transform={['-50%', '-50%']}
          />
          <Circle
            opacity={0.5}
            color="#5CECDB"
            coords={[, , 0, 0]}
            size={200}
            transform={['50%', '30%']}
          />
          <ContentContainer>
            <section className={styles.learnBackendSection}>
              <div className={styles.textContainer}>
                <div className={styles.header}>
                  <h3>MANAGE BIG DATA</h3>

                  <h1>Learn database and server development</h1>

                  <p>
                    Leverage the most modern frameworks used in the software
                    development industry to build professional-grade mobile
                    apps.{' '}
                  </p>
                </div>

                <div className={styles.highlightsContainer}>
                  <LearnBackendHighlight title="Learn SQL">
                    The most in demand skillset for developers. So in demand,
                    that its assumed that each developers has some form of
                    knowledge of SQL.
                  </LearnBackendHighlight>

                  <LearnBackendHighlight title="Learn APIs">
                    Learn how servers and website communicate with eachother
                    using custom web URLs.
                  </LearnBackendHighlight>
                </div>
              </div>

              <HomeSqlView
                left={{
                  propertySelection: ['*'],
                  table: 'users',
                  output: SQL_OUTPUTS.left,
                }}
                right={{
                  propertySelection: ['first_name'],
                  table: 'users',
                  output: SQL_OUTPUTS.right,
                }}
              />
            </section>
          </ContentContainer>
        </SkewBackground>

        <section className={styles.formConnectionsSection}>
          <ContentContainer>
            <h3>FORM CONNECTIONS</h3>

            <h1 className={styles.title}>
              Connect with the <br /> developer community
            </h1>
          </ContentContainer>

          <ContentContainer>
            <div className={styles.content}>
              <ContentContainer noPadding>
                <div className={styles.imgContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Connect-World-Vector.svg" alt="" />
                </div>
              </ContentContainer>

              <p className={styles.description}>
                Form long lasting connections with students at Franklin and
                professional developers to help you advance your career as a
                Software Engineer.
              </p>

              <div className={styles.buttonsContainer}>
                <button className={styles.button}>View our socials</button>
              </div>
            </div>
          </ContentContainer>
        </section>

        <Footer />
      </main>
    </div>
  );
}

const SKEW_DEG = 6;
const SQL_OUTPUTS = {
  left: `\
---------------------------------
|  id  | first_name | last_name |
---------------------------------
|  00  | Jose       | Cano      |
|  01  | John       | Doe       |
|  02  | Bobby      | Brown     |
---------------------------------`,
  right: `\
--------------
| first_name |
--------------
| Jose       |
| John       |
| Bobby      |
--------------`,
};

interface LearnBackendHighlightProps {
  title: string;
  children: React.ReactNode;
}

function LearnBackendHighlight({
  children,
  title,
}: LearnBackendHighlightProps) {
  return (
    <div className={styles.learnBackendHighlight}>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}

interface CircleProps {
  size: number;
  opacity?: number;
  color?: string;
  /**
   * The position of the circle in the background in order of
   * left, top, right, and bottom.
   */
  coords?: [number?, number?, number?, number?];
  transform?: [number | string, number | string];
}

function Circle({
  size,
  coords = [undefined, undefined, undefined, undefined],
  opacity = 1,
  transform = [0, 0],
  color,
}: CircleProps) {
  return (
    <figure
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: color
          ? undefined
          : 'linear-gradient(to bottom right, #47d6cf, #4d4add)',
        backgroundColor: color,
        left: coords[0],
        top: coords[1],
        right: coords[2],
        bottom: coords[3],
        borderRadius: 9999,
        opacity,
        overflow: 'clip',
        transform: `translate(${transform[0]}, ${transform[1]})`,
      }}
    />
  );
}
