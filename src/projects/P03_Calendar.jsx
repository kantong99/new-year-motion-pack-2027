import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, clampTween } from '../components/Transitions.jsx';

// Kalender yang membalik halaman tiap bulan, berakhir di 2027
const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
const MONTH_FRAMES = 60;
const PAGE_W = 620;
const PAGE_H = 640;
const DAYS = 28; // grid 7 x 4 agar sederhana

const Page = ({ label, rotX, shade }) => (
  <div
    style={{
      position: 'absolute',
      left: DESIGN_W / 2 - PAGE_W / 2,
      top: DESIGN_H / 2 - PAGE_H / 2,
      width: PAGE_W,
      height: PAGE_H,
      borderRadius: 22,
      background: 'linear-gradient(170deg, #fffbeb, #fef3c7)',
      boxShadow: '0 40px 90px rgba(0,0,0,0.5)',
      transformOrigin: 'center top',
      transform: `rotateX(${rotX}deg)`,
      backfaceVisibility: 'hidden',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      color: '#78350f',
    }}
  >
    <div style={{ height: 150, background: '#b45309', color: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, letterSpacing: 6 }}>
      {label}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14, padding: 36, fontSize: 30, fontWeight: 700, textAlign: 'center' }}>
      {Array.from({ length: DAYS }, (_, i) => (
        <div
          key={i}
          style={{
            height: 80,
            lineHeight: '80px',
            borderRadius: 14,
            background: i === 11 ? '#f59e0b' : 'rgba(180,83,9,0.08)',
            color: i === 11 ? '#fff' : '#78350f',
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${shade})`, pointerEvents: 'none' }} />
  </div>
);

export const P03_Calendar = () => {
  const frame = useCurrentFrame();

  // Setiap bulan: separuh pertama halaman lama turun, separuh kedua halaman baru naik
  const idx = Math.min(MONTHS.length - 1, Math.floor(frame / MONTH_FRAMES));
  const local = (frame - idx * MONTH_FRAMES) / MONTH_FRAMES;
  const flipping = idx < MONTHS.length - 1 && local > 0.55;
  const flipP = clampTween(local, [0.55, 1], [0, 1]);
  const oldRot = flipping ? -180 * flipP : 0;
  const newRot = flipping ? 180 - 180 * flipP : 0;
  const isEnd = frame >= MONTH_FRAMES * (MONTHS.length - 1) + 30;

  const current = MONTHS[idx];
  const next = MONTHS[Math.min(MONTHS.length - 1, idx + 1)];

  return (
    <CameraStage background="#1c0f03" zoom={[0.96, 1.05]} rotateX={[-4, 3]} rotateY={[-4, 4]} perspective={2400}>
      <Background base="#1c0f03" glowA="rgba(251,191,36,0.18)" glowB="rgba(180,83,9,0.22)" gridColor="rgba(251,191,36,0.05)" />

      {!isEnd && flipping && <Page label={current} rotX={oldRot} shade={0.35 * flipP} />}
      {!isEnd && !flipping && <Page label={current} rotX={0} shade={0} />}
      {!isEnd && flipping && <Page label={next} rotX={newRot} shade={0.35 * (1 - flipP)} />}

      {isEnd && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 380,
            width: DESIGN_W,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 900,
            fontSize: 300,
            letterSpacing: 12,
            color: '#fde68a',
            opacity: clampTween(frame, [MONTH_FRAMES * 11 + 30, MONTH_FRAMES * 11 + 70], [0, 1]),
            textShadow: '0 0 60px rgba(251,191,36,0.5)',
          }}
        >
          2027
        </div>
      )}

      <Caption
        title="KALENDER 2027"
        subtitle="Dua belas bulan, satu rencana"
        accent="#fbbf24"
        x={140}
        y={120}
      />
    </CameraStage>
  );
};
