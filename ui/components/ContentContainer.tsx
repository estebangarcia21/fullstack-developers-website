import styles from './ContentContainer.module.scss';

export interface ContentContainerProps {
  noPadding?: boolean;
  relative?: boolean;
  children: React.ReactNode;
}

export function ContentContainer({
  children,
  noPadding,
  relative,
}: ContentContainerProps) {
  return (
    <div
      className={noPadding ? styles.noPaddingContainer : styles.container}
      style={{ position: relative ? 'relative' : 'static' }}
    >
      {children}
    </div>
  );
}
