import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, clampTween } from '../components/Transitions.jsx';

// Lampion Imlek yang naik dengan ayunan, dan kembang api berwarna emas dan merah
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const rand = seeded(2028);
const LANTERNS = Array.from({ length: 12 }, () => ({
  x: 120 + rand() * 1680,
  speed: 1.2 + rand() * 1.4,
  offset: rand() * 1400,
  size: 0.7 + rand() * 0.6,
  sway: 20 + rand() * 40,
  phase: rand() * Math.PI * 2,
}));

const FIREWORK_FRAMES = [140, 330, 500];
const RAYS = Array.from({ length: 36 }, (_, i) => (i / 36) * Math.PI * 2);

const Lantern = ({ l, frame }) => {
  const y = 1300 - ((frame * l.speed + l.offset) % 1500);
  const x = l.x + Math.sin(frame / 40 + l.phase) * l.sway;
  const w = 130 * l.size;
  const h = 170 * l.size;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={0} y1={-h / 2 - 90} x2={0} y2={-h / 2} stroke="#fde68a" strokeWidth={3} />
      <rect x={-w / 2 - 6} y={-h / 2 - 16} width={w + 12} height={18} rx={6} fill="#b45309" />
      <rect x={-w / 2 - 6} y={h / 2 - 2} width={w + 12} height={18} rx={6} fill="#b45309" />
      <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill="url(#lanternG)" stroke="#fde68a" strokeWidth={3} />
      {[-0.5, 0, 0.5].map((k) => (
        <ellipse key={k} cx={k * w * 0.5} cy={0} rx={w * 0.12} ry={h / 2 - 6} fill="none" stroke="rgba(254,240,138,0.55)" strokeWidth={3} />
      ))}
      <line x1={0} y1={h / 2 + 18} x2={0} y2={h / 2 + 70} stroke="#fde68a" strokeWidth={3} />
      <circle cx={0} cy={h / 2 + 80} r={8 * l.size} fill="#fde68a" />
    </g>
  );
};

export const P10_Lantern = () => {
  const frame = useCurrentFrame();

  return (
    <CameraStage background="#2a0606" zoom={[0.96, 1.05]} rotateY={[-5, 5]} perspective={2200}>
      <Background base="#2a0606" glowA="rgba(239,68,68,0.28)" glowB="rgba(250,204,21,0.14)" gridColor="rgba(250,204,21,0.04)" />

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        <defs>
          <radialGradient id="lanternG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="55%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
        </defs>

        {LANTERNS.map((l, i) => (
          <Lantern key={i} l={l} frame={frame} />
        ))}

        {/* Kembang api di beberapa titik waktu */}
        {FIREWORK_FRAMES.map((f0, fi) => {
          const local = frame - f0;
          if (local < 0 || local > 90) return null;
          const cx = 480 + fi * 480;
          const cy = 300 + (fi % 2) * 120;
          const r0 = 10 + clampTween(local, [0, 90], [0, 260]);
          const fade = clampTween(local, [40, 90], [1, 0]);
          return (
            <g key={f0} opacity={fade}>
              {RAYS.map((a, i) => (
                <line
                  key={i}
                  x1={cx + Math.cos(a) * r0 * 0.6}
                  y1={cy + Math.sin(a) * r0 * 0.6}
                  x2={cx + Math.cos(a) * r0}
                  y2={cy + Math.sin(a) * r0}
                  stroke={i % 3 === 0 ? '#fde68a' : i % 3 === 1 ? '#fbbf24' : '#f87171'}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </svg>

      <Particles color="#fde68a" count={70} seed={55} speed={0.6} minSize={2} maxSize={6} />

      <Caption title="SELAMAT IMLEK" subtitle="Gong Xi Fa Cai · Rezeki dan kebahagiaan" accent="#fbbf24" x={140} y={100} />
    </CameraStage>
  );
};
