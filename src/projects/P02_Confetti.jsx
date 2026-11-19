import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, useIntro } from '../components/Transitions.jsx';

// Pita emas yang tersapu dan confetti 3D yang jatuh
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const rand = seeded(2027);
const CONFETTI = Array.from({ length: 140 }, () => ({
  x: rand() * DESIGN_W,
  y0: rand() * DESIGN_H,
  speed: 2 + rand() * 4,
  spin: (rand() - 0.5) * 12,
  tilt: rand() * 180,
  w: 10 + rand() * 14,
  h: 4 + rand() * 6,
  color: ['#fbbf24', '#f472b6', '#38bdf8', '#34d399', '#f8fafc', '#a78bfa'][Math.floor(rand() * 6)],
}));

// Pita melengkung yang sisinya diisi warna emas
const ribbonPath = (phase) => {
  const pts = [];
  for (let x = -80; x <= DESIGN_W + 80; x += 20) {
    const y = 540 + 140 * Math.sin(x / 260 + phase) + 40 * Math.sin(x / 110 - phase * 1.3);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
};

export const P02_Confetti = () => {
  const frame = useCurrentFrame();
  const intro = useIntro();
  const sweep = Math.min(1, Math.max(0, (frame - 40) / 120));
  const ribbonWidth = 260;
  const ribbonX = -ribbonWidth + sweep * (DESIGN_W + ribbonWidth * 2);

  return (
    <CameraStage background="#0a0614" zoom={[0.95, 1.08]} rotateX={[6, -4]} rotateY={[-6, 6]} perspective={1800}>
      <Background base="#0a0614" glowA="rgba(251,191,36,0.18)" glowB="rgba(244,114,182,0.16)" gridColor="rgba(251,191,36,0.05)" />

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        <defs>
          <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <clipPath id="ribbonClip">
            <rect x={ribbonX} y={0} width={ribbonWidth} height={DESIGN_H} />
          </clipPath>
        </defs>

        {/* Pita emas dua lapis: tipis di belakang, tebal di depan */}
        <path d={ribbonPath(frame / 26)} fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth={90} strokeLinecap="round" />
        <path d={ribbonPath(frame / 26)} fill="none" stroke="url(#goldRibbon)" strokeWidth={36} strokeLinecap="round" clipPath="url(#ribbonClip)" />
        <path d={ribbonPath(frame / 26 + 0.8)} fill="none" stroke="rgba(244,114,182,0.5)" strokeWidth={14} strokeLinecap="round" />

        {/* Confetti yang jatuh dengan putaran 3D */}
        {CONFETTI.map((c, i) => {
          const y = ((c.y0 + frame * c.speed) % (DESIGN_H + 80)) - 40;
          const x = c.x + Math.sin(frame / 30 + i) * 30;
          const flip = Math.cos((frame * c.spin + c.tilt) * (Math.PI / 180));
          return (
            <rect
              key={`c-${i}`}
              x={x - c.w / 2}
              y={y - c.h / 2}
              width={c.w}
              height={c.h * Math.abs(flip) + 1}
              rx={2}
              fill={c.color}
              opacity={intro * 0.95}
              transform={`rotate(${frame * c.spin} ${x} ${y})`}
            />
          );
        })}
      </svg>

      <Caption
        title="TAHUN BARU, MULAI LAGI"
        subtitle="Pesta Confetti · Pembukaan Tahun"
        accent="#fbbf24"
        x={140}
        y={120}
      />
    </CameraStage>
  );
};
