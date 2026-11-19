import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, Label, useIntro } from '../components/Transitions.jsx';

// Lanskap energi terbarukan: matahari terbit, turbin angin berputar, dan panel surya berkilau
const TURBINES = [
  { x: 520, base: 760, s: 1.0, speed: 2.2, phase: 0 },
  { x: 980, base: 720, s: 0.8, speed: 2.8, phase: 40 },
  { x: 1400, base: 700, s: 0.62, speed: 3.4, phase: 80 },
];

const bladePath = (len) => `M 0 0 L ${-len * 0.12} ${-len} L ${len * 0.12} ${-len} Z`;

const Turbine = ({ x, base, s, speed, frame, phase }) => {
  const h = 420 * s;
  const hub = { x, y: base - h };
  const angle = (frame + phase) * speed;
  return (
    <g>
      <rect x={x - 7 * s} y={base - h} width={14 * s} height={h} fill="#e2e8f0" />
      <g transform={`translate(${hub.x} ${hub.y}) rotate(${angle})`}>
        {[0, 120, 240].map((a) => (
          <path key={a} d={bladePath(230 * s)} transform={`rotate(${a})`} fill="#f8fafc" />
        ))}
        <circle cx={0} cy={0} r={12 * s} fill="#cbd5e1" />
      </g>
    </g>
  );
};

export const P07_Renewable = () => {
  const frame = useCurrentFrame();
  const intro = useIntro();

  // Matahari naik sepanjang busur
  const t = Math.min(1, frame / 360);
  const sunX = 240 + t * 1440;
  const sunY = 760 - Math.sin(t * Math.PI) * 480;
  const sunBright = 0.6 + 0.4 * Math.sin(frame / 30);

  // Kilau di panel surya bergerak dari kiri ke kanan
  const shine = (frame * 9) % 2400 - 400;

  return (
    <CameraStage background="#0c2a3f" zoom={[0.98, 1.06]} panX={[-40, 40]} rotateY={[-3, 3]} perspective={2400}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0f3d5c 0%,#1e7f8c 45%,#f6c177 78%,#fde68a 100%)', opacity: intro }} />

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        <defs>
          <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="rgba(253,224,71,0.8)" />
            <stop offset="100%" stopColor="rgba(253,224,71,0)" />
          </radialGradient>
          <linearGradient id="panelG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id="shineG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Matahari */}
        <circle cx={sunX} cy={sunY} r={220} fill="url(#sunG)" opacity={sunBright} />
        <circle cx={sunX} cy={sunY} r={70} fill="#fef08a" />

        {/* Bukit berlapis dengan efek paralaks dari kamera */}
        <path d="M -40 900 Q 300 700 620 860 T 1320 820 T 2000 880 L 2000 1100 L -40 1100 Z" fill="#14532d" opacity={0.85} />
        <path d="M -40 960 Q 420 840 800 950 T 1500 920 T 2000 960 L 2000 1100 L -40 1100 Z" fill="#166534" />

        {/* Panel surya dengan kilau */}
        {Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 6 }, (_, c) => {
            const x = 1040 + c * 130 + r * 30;
            const y = 840 + r * 52;
            return (
              <g key={`p-${r}-${c}`}>
                <polygon points={`${x},${y} ${x + 120},${y} ${x + 100},${y + 44} ${x - 20},${y + 44}`} fill="url(#panelG)" stroke="#93c5fd" strokeWidth={2} />
              </g>
            );
          })
        )}
        <rect x={shine} y={780} width={260} height={230} fill="url(#shineG)" />

        {TURBINES.map((tb) => (
          <Turbine key={tb.x} {...tb} frame={frame} />
        ))}
      </svg>

      <Caption title="ENERGI TERBARUKAN" subtitle="Angin · Surya · Masa depan bersih" accent="#fde68a" x={140} y={120} color="#f8fafc" subColor="rgba(255,251,235,0.9)" />
      <Label text="TURBIN ANGIN" x={380} y={360} color="#f8fafc" delay={60} width={180} />
      <Label text="PANEL SURYA" x={1080} y={640} color="#f8fafc" delay={100} width={180} />
    </CameraStage>
  );
};
