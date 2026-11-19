import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Paket lower third: dua judul bergantian di atas latar gerak yang menyerupai footage
const LOWER_THIRDS = [
  { start: 60, end: 300, name: 'NAMA PEMBICARA', role: 'Jabatan · Perusahaan', color: '#38bdf8' },
  { start: 340, end: 620, name: 'JUDUL SEGMEN', role: 'Keterangan singkat di bawah judul', color: '#fbbf24' },
];

const LowerThird = ({ frame, item }) => {
  const inP = clampTween(frame, [item.start, item.start + 30], [0, 1]);
  const outP = clampTween(frame, [item.end - 30, item.end], [1, 0]);
  const p = Math.min(inP, outP);
  if (p <= 0) return null;
  const barW = 1000 * p;
  const textX = clampTween(frame, [item.start + 14, item.start + 44], [-60, 0]);
  return (
    <div style={{ position: 'absolute', left: 120, top: 800, width: 1100, height: 170, fontFamily: 'Arial, sans-serif', opacity: p }}>
      {/* Bilah utama yang tersapu dari kiri */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: barW, height: 170, background: 'linear-gradient(90deg, rgba(15,23,42,0.92), rgba(15,23,42,0.75))', borderLeft: `14px solid ${item.color}`, borderRadius: 10, overflow: 'hidden' }} />
      <div style={{ position: 'absolute', left: 60 + textX, top: 30, color: '#f8fafc', fontWeight: 900, fontSize: 64, letterSpacing: 2, whiteSpace: 'nowrap', opacity: p }}>
        {item.name}
      </div>
      <div style={{ position: 'absolute', left: 60 + textX, top: 112, color: item.color, fontWeight: 600, fontSize: 36, letterSpacing: 1, whiteSpace: 'nowrap', opacity: p }}>
        {item.role}
      </div>
    </div>
  );
};

export const P08_LowerThird = () => {
  const frame = useCurrentFrame();
  // Latar seperti footage: gradien bergerak dan kotak yang melayang
  const shift = frame * 1.5;

  return (
    <CameraStage background="#0b1220" zoom={[1.0, 1.02]} perspective={2000}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${120 + shift / 10}deg, #1e3a8a 0%, #0e7490 35%, #7c3aed 70%, #be185d 100%)`,
          filter: 'saturate(1.1)',
        }}
      />
      <div style={{ position: 'absolute', left: 260 + Math.sin(frame / 60) * 90, top: 180, width: 700, height: 420, borderRadius: 40, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)' }} />
      <div style={{ position: 'absolute', left: 1060 + Math.cos(frame / 80) * 70, top: 300, width: 520, height: 300, borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)' }} />
      <Particles color="#f0f9ff" count={60} seed={303} speed={0.8} minSize={2} maxSize={7} />

      {LOWER_THIRDS.map((item) => (
        <LowerThird key={item.name} frame={frame} item={item} />
      ))}
    </CameraStage>
  );
};
