import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Empat adegan dengan transisi lingkaran membuka dan kebocoran cahaya (light leak)
const SCENES = [
  { bg: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', title: 'TRANSISI 01', sub: 'Lingkaran membuka dari pusat', accent: '#f0abfc' },
  { bg: 'linear-gradient(135deg,#0c4a6e,#0e7490)', title: 'TRANSISI 02', sub: 'Kebocoran cahaya hangat', accent: '#fde68a' },
  { bg: 'linear-gradient(135deg,#3f1d1d,#9a3412)', title: 'TRANSISI 03', sub: 'Sapuan cahaya bergerak', accent: '#fdba74' },
  { bg: 'linear-gradient(135deg,#052e16,#166534)', title: 'TRANSISI 04', sub: 'Kembali ke tema utama', accent: '#bbf7d0' },
];
const SCENE_LEN = 180;
const TRANSITION = 40;

const Scene = ({ scene, clip }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: scene.bg,
      clipPath: clip,
      fontFamily: 'Arial, sans-serif',
      color: '#f8fafc',
      textAlign: 'center',
    }}
  >
    <div style={{ position: 'absolute', left: 0, right: 0, top: 380, fontSize: 150, fontWeight: 900, letterSpacing: 10, color: scene.accent }}>{scene.title}</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 580, fontSize: 56, fontWeight: 500, letterSpacing: 4 }}>{scene.sub}</div>
  </div>
);

export const P09_LightLeak = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(SCENES.length - 1, Math.floor(frame / SCENE_LEN));
  const boundary = (idx + 1) * SCENE_LEN;
  // Transisi terjadi di akhir setiap adegan, dan adegan berikutnya membuka dari tengah
  const tStart = boundary - TRANSITION;
  const showNext = idx < SCENES.length - 1 && frame >= tStart;
  const t = clampTween(frame, [tStart, boundary], [0, 1]);
  const radius = Math.max(0, t * 1700);
  const clipNext = `circle(${radius}px at ${DESIGN_W / 2}px ${DESIGN_H / 2}px)`;

  // Kebocoran cahaya: bulatan hangat yang melintas saat transisi
  const leakOpacity = showNext ? Math.sin(t * Math.PI) * 0.85 : 0;
  const leakX = -400 + t * (DESIGN_W + 800);

  return (
    <CameraStage background="#000" zoom={[0.98, 1.04]} perspective={2000}>
      <Scene scene={SCENES[idx]} clip="none" />
      {showNext && idx + 1 < SCENES.length && <Scene scene={SCENES[idx + 1]} clip={clipNext} />}

      {/* Lapisan kebocoran cahaya dengan mode layar */}
      <div
        style={{
          position: 'absolute',
          left: leakX - 600,
          top: -200,
          width: 1200,
          height: DESIGN_H + 400,
          background: 'radial-gradient(ellipse at center, rgba(255,186,120,0.9), rgba(251,113,133,0.4) 40%, transparent 70%)',
          mixBlendMode: 'screen',
          opacity: leakOpacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: DESIGN_W - leakX - 500,
          top: -200,
          width: 900,
          height: DESIGN_H + 400,
          background: 'radial-gradient(ellipse at center, rgba(253,224,71,0.7), transparent 65%)',
          mixBlendMode: 'screen',
          opacity: leakOpacity * 0.7,
          pointerEvents: 'none',
        }}
      />
    </CameraStage>
  );
};
