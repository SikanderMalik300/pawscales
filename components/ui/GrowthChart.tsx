import * as React from 'react';

export interface ChartPoint {
  x: number; // weeks
  mid: number; // median curve value (display units)
  low?: number; // p25
  high?: number; // p75
}

/**
 * Lightweight inline SVG chart (design.md 7.7): horizontal 1px grid lines only,
 * 12px muted tabular axis labels, 2.5px brand median line, brand-tint P25-P75
 * band, the user's point as an 8px accent dot with a 1.5px ink outline. Server-
 * rendered with the default example. A text equivalent must accompany it.
 */
export function GrowthChart({
  points,
  userPoint,
  yLabel = 'weight',
  yUnit = 'lb',
  xLabel = 'age (weeks)',
  width = 560,
  height = 220,
}: {
  points: ChartPoint[];
  userPoint?: { x: number; y: number; label?: string };
  yLabel?: string;
  yUnit?: string;
  xLabel?: string;
  width?: number;
  height?: number;
}) {
  const padL = 44;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const w = width;
  const h = height;
  const xs = points.map((p) => p.x);
  const highs = points.map((p) => p.high ?? p.mid);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs, userPoint?.x ?? -Infinity);
  const yMax = Math.max(...highs, userPoint?.y ?? 0) * 1.05;
  const yMin = 0;

  const sx = (x: number) =>
    padL + ((x - xMin) / (xMax - xMin || 1)) * (w - padL - padR);
  const sy = (y: number) =>
    h - padB - ((y - yMin) / (yMax - yMin || 1)) * (h - padT - padB);

  const line = (key: 'mid' | 'low' | 'high') =>
    points
      .map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy((p[key] ?? p.mid)).toFixed(1)}`)
      .join(' ');

  const band =
    points.every((p) => p.low != null && p.high != null)
      ? [
          ...points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.high!).toFixed(1)}`),
          ...points
            .slice()
            .reverse()
            .map((p) => `L${sx(p.x).toFixed(1)},${sy(p.low!).toFixed(1)}`),
          'Z',
        ].join(' ')
      : null;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i);
  const xTickVals = [xMin, Math.round((xMin + xMax) / 2), xMax];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label={`Growth curve of ${yLabel} in ${yUnit} by ${xLabel}`}
      className="tabular-nums"
    >
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={w - padR}
            y1={sy(t)}
            y2={sy(t)}
            stroke="var(--border)"
            strokeWidth={1}
          />
          <text
            x={padL - 6}
            y={sy(t) + 4}
            textAnchor="end"
            fontSize="12"
            fill="var(--muted)"
          >
            {Math.round(t)}
          </text>
        </g>
      ))}
      {xTickVals.map((xv, i) => (
        <text
          key={i}
          x={sx(xv)}
          y={h - padB + 18}
          textAnchor="middle"
          fontSize="12"
          fill="var(--muted)"
        >
          {xv}
        </text>
      ))}
      {band && <path d={band} fill="var(--brand-tint)" stroke="none" />}
      <path d={line('mid')} fill="none" stroke="var(--brand)" strokeWidth={2.5} />
      {userPoint && (
        <>
          <circle
            cx={sx(userPoint.x)}
            cy={sy(userPoint.y)}
            r={8}
            fill="var(--accent)"
            stroke="var(--ink)"
            strokeWidth={1.5}
          />
          {userPoint.label && (
            <text
              x={sx(userPoint.x)}
              y={sy(userPoint.y) - 12}
              textAnchor="middle"
              fontSize="12"
              fontWeight={600}
              fill="var(--ink)"
            >
              {userPoint.label}
            </text>
          )}
        </>
      )}
    </svg>
  );
}
