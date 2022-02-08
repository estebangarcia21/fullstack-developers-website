export interface SkewBackgroundProps {
  children: React.ReactNode;
  color: string;
  skewAxis: 'X' | 'Y';
  deg: number;
  height?: number | string;
}

export function SkewBackground({
  children,
  color,
  deg,
  skewAxis,
  height = '100%',
}: SkewBackgroundProps) {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div
        style={{
          backgroundColor: color,
          position: 'absolute',
          overflow: 'hidden',
          width: '100%',
          transform: `skew${skewAxis}(-${Math.abs(deg)}deg)`,
          transformOrigin: 'left bottom',
          zIndex: 0,
          height,
        }}
      />

      <div
        style={{
          transform: `skew${skewAxis}(0deg)`,
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}
