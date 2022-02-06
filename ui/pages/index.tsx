import { ContentContainer } from 'components/ContentContainer';
import { Footer } from 'components/Footer';
import { Navbar } from 'components/Navbar';
import { SkewBackground } from 'components/SkewBackground';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from 'styles/pages/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Franklin Fullstack Developers</title>
        <meta name="description" content="Franklin Computer Science" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <SkewBackground color="#58D088" deg={12} skewAxis="Y" height="45%">
          <Navbar />

          <ContentContainer>
            <header className={styles.header}>
              <h3 className={styles.subtitle}>Franklin High School</h3>

              <h1 className={styles.title}>
                Fullstack
                <br />
                Developers
                <br />
                Club
              </h1>

              <p className={styles.description}>
                Learn software engineering. <br /> No previous experience
                necessary.
              </p>

              <div className={styles.buttonContainer}>
                <button className={styles.joinButton}>Join the club</button>
              </div>
            </header>
          </ContentContainer>
        </SkewBackground>

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

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Mobile-Vector.svg" alt="" className={styles.img} />
            </div>
          </section>
        </ContentContainer>

        <SkewBackground color="#0D4242" skewAxis="Y" deg={11}>
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
            transform={['50%', '-15%']}
          />

          <ContentContainer>
            <section className={styles.learnBackendSection}>
              <h3>MANAGE BIG DATA</h3>

              <h1>Learn database and server development</h1>

              <p>
                Leverage the most modern frameworks used in the software
                development industry to build professional-grade mobile apps.{' '}
              </p>

              <div className={styles.highlightsContainer}>
                <LearnBackendHighlight title="Learn SQL">
                  The most in demand skillset for developers. So in demand, that
                  its assumed that each developers has some form of knowledge of
                  SQL.
                </LearnBackendHighlight>

                <LearnBackendHighlight title="Learn APIs">
                  Learn how servers and website communicate with eachother using
                  custom web URLs.
                </LearnBackendHighlight>
              </div>
            </section>
          </ContentContainer>
        </SkewBackground>

        <section className={styles.formConnectionsSection}>
          <ContentContainer>
            <h3>FORM CONNECTIONS</h3>

            <h1 className={styles.title}>
              Connect with the developer community
            </h1>
          </ContentContainer>

          <div className={styles.content}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Connect-World-Vector.svg"
              alt=""
              className={styles.img}
            />

            <ContentContainer>
              <p className={styles.description}>
                Form long lasting connections with students at Franklin and
                professional developers to help you advance your career as a
                Software Engineer.
              </p>

              <div className={styles.buttonsContainer}>
                <button className={styles.button}>View our socials</button>
              </div>
            </ContentContainer>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
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
          : 'linear-gradient(to bottom right, #47D6AB, #4ADD58)',
        backgroundColor: color,
        left: coords[0],
        top: coords[1],
        right: coords[2],
        bottom: coords[3],
        borderRadius: 9999,
        opacity,
        transform: `translate(${transform[0]}, ${transform[1]})`,
      }}
    />
  );
}

export default Home;
