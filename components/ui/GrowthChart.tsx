import * as React from 'react';

export interface ChartPoint {
  x: number; // weeks
  mid: number;
  low?: number;
  high?: number;
}

/** Nice round step for an axis max, so ticks read 0,10,20... not 0,15.3,... */
function niceStep(max: number, targetTicks = 4): number {
  const raw = max / targetTicks;
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  const norm = raw / mag;
  const step = norm >= 5 ? 5 : norm >= 2 ? 2 : 1;
  return step * mag;
}

/**
 * Inline SVG chart (design.md v2 7.7): horizontal grid only, 12px muted round
 * tick values, 2.5px brand median line, rgba brand P25-P75 band, 10px accent
 * user dot with a 2px white ring and a white label pill offset to whichever side
 * has more room so it never overlaps the line. Text equivalent lives beside it.
 */
export function GrowthChart({
  points,
  userPoint,
  yUnit = 'lb',
  xUnit = 'weeks',
  width = 560,
  height = 230,
}: {
  points: ChartPoint[];
  userPoint?: { x: number; y: number; label?: string };
  yUnit?: string;
  xUnit?: string;
  width?: number;
  height?: number;
}) {
  const padL = 40;
  const padR = 14;
  const padT = 16;
  const padB = 28;
  const w = width;
  const h = height;

  const xs = points.map((p) => p.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs, userPoint?.x ?? -Infinity);
  const dataMax = Math.max(
    ...points.map((p) => p.high ?? p.mid),
    userPoint?.y ?? 0,
  );
  const step = niceStep(dataMax);
  const yMax = Math.ceil(dataMax / step) * step;

  const sx = (x: number) =>
    padL + ((x - xMin) / (xMax - xMin || 1)) * (w - padL - padR);
  const sy = (y: number) => h - padB - (y / (yMax || 1)) * (h - padT - padB);

  const path = (key: 'mid' | 'low' | 'high') =>
    points
      .map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p[key] ?? p.mid).toFixed(1)}`)
      .join(' ');

  const band = points.every((p) => p.low != null && p.high != null)
    ? [
        ...points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.high!).toFixed(1)}`),
        ...points.slice().reverse().map((p) => `L${sx(p.x).toFixed(1)},${sy(p.low!).toFixed(1)}`),
        'Z',
      ].join(' ')
    : null;

  const yTicks: number[] = [];
  for (let t = 0; t <= yMax + 1e-6; t += step) yTicks.push(t);

  // x ticks: round weeks across the range
  const xStep = niceStep(xMax - xMin, 4);
  const xTicks: number[] = [];
  for (let t = Math.ceil(xMin / xStep) * xStep; t <= xMax + 1e-6; t += xStep) {
    xTicks.push(Math.round(t));
  }

  // user label pill: place on the side with more room, above the dot
  let labelBox: React.ReactNode = null;
  if (userPoint?.label) {
    const dotX = sx(userPoint.x);
    const dotY = sy(userPoint.y);
    const placeLeft = dotX > (padL + (w - padR)) / 2;
    const text = userPoint.label;
    const boxW = Math.max(54, text.length * 6.6 + 14);
    const boxH = 20;
    let bx = placeLeft ? dotX - boxW - 12 : dotX + 12;
    bx = Math.max(padL, Math.min(bx, w - padR - boxW));
    let by = dotY - boxH - 10;
    if (by < padT) by = dotY + 10;
    labelBox = (
      <g>
        <rect x={bx} y={by} width={boxW} height={boxH} rx={10} fill="#fff" stroke="var(--line)" />
        <text x={bx + boxW / 2} y={by + 14} textAnchor="middle" fontSize="12" fontWeight={600} fill="var(--ink)">
          {text}
        </text>
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label={`Growth curve of weight in ${yUnit} by age in ${xUnit}`}
      className="tabular-nums"
    >
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={w - padR} y1={sy(t)} y2={sy(t)} stroke="var(--line)" strokeWidth={1} />
          <text x={padL - 6} y={sy(t) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">
            {t}
          </text>
        </g>
      ))}
      {xTicks.map((xv, i) => (
        <text key={i} x={sx(xv)} y={h - padB + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">
          {xv}
        </text>
      ))}
      {band && <path d={band} fill="rgba(31,92,69,.12)" stroke="none" />}
      <path d={path('mid')} fill="none" stroke="var(--brand)" strokeWidth={2.5} strokeLinejoin="round" />
      {userPoint && (
        <>
          <circle cx={sx(userPoint.x)} cy={sy(userPoint.y)} r={10} fill="var(--accent)" stroke="#fff" strokeWidth={2} />
          {labelBox}
        </>
      )}
    </svg>
  );
}
