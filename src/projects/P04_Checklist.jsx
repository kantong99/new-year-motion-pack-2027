import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, clampTween } from '../components/Transitions.jsx';

// Daftar resolusi tahun baru: setiap kotak tercentang satu per satu
const ITEMS = ['Lebih sehat setiap hari', 'Belajar hal baru', 'Menabung tiap bulan', 'Rutin berolahraga', 'Lebih banyak waktu keluarga'];
const CARD_W = 1000;
const CARD_X = (DESIGN_W - CARD_W) / 2;
const ROW_H = 118;
const START = 70;
const STEP = 55;

export const P04_Checklist = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = spring({ frame, fps, config: { damping: 18 } });
  const doneCount = ITEMS.filter((_, i) => frame >= START + i * STEP + 26).length;
  const progress = clampTween(frame, [START, START + ITEMS.length * STEP + 20], [0, 1]);

  return (
    <CameraStage background="#06121f" zoom={[0.97, 1.04]} rotateY={[-5, 5]} rotateX={[3, -3]} perspective={2200}>
      <Background base="#06121f" glowA="rgba(56,189,248,0.2)" glowB="rgba(52,211,153,0.15)" gridColor="rgba(56,189,248,0.05)" />

      <div
        style={{
          position: 'absolute',
          left: CARD_X,
          top: 200 + (1 - cardIn) * 60,
          width: CARD_W,
          height: 760,
          borderRadius: 32,
          background: 'linear-gradient(160deg, rgba(15,23,42,0.92), rgba(15,23,42,0.7))',
          border: '2px solid rgba(56,189,248,0.35)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          opacity: cardIn,
          fontFamily: 'Arial, sans-serif',
          color: '#e2e8f0',
        }}
      >
        <div style={{ position: 'absolute', left: 60, top: 44, fontSize: 56, fontWeight: 800, color: '#f8fafc' }}>Resolusi 2027</div>
        <div style={{ position: 'absolute', right: 60, top: 56, fontSize: 36, fontWeight: 700, color: '#7dd3fc' }}>{doneCount}/{ITEMS.length}</div>

        {/* Bilah kemajuan */}
        <div style={{ position: 'absolute', left: 60, top: 124, width: CARD_W - 120, height: 12, borderRadius: 6, background: 'rgba(148,163,184,0.2)' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#38bdf8,#34d399)' }} />
        </div>

        {ITEMS.map((text, i) => {
          const local = frame - (START + i * STEP);
          const box = spring({ frame: Math.max(0, local), fps, config: { damping: 16, stiffness: 150 } });
          const checked = frame >= START + i * STEP + 26;
          const tick = clampTween(frame, [START + i * STEP + 14, START + i * STEP + 26], [0, 1]);
          const top = 190 + i * ROW_H;
          return (
            <div key={text} style={{ position: 'absolute', left: 60, top, width: CARD_W - 120, height: ROW_H - 16, display: 'flex', alignItems: 'center', gap: 36, opacity: clampTween(box, [0, 1], [0.2, 1]) }}>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 14,
                  border: `4px solid ${checked ? '#34d399' : '#64748b'}`,
                  background: checked ? 'rgba(52,211,153,0.2)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${0.85 + 0.15 * box})`,
                }}
              >
                <svg width={44} height={44} viewBox="0 0 44 44">
                  <path d="M 8 24 L 18 34 L 36 12" fill="none" stroke="#34d399" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - tick)} />
                </svg>
              </div>
              <div style={{ fontSize: 46, fontWeight: 600, color: checked ? '#94a3b8' : '#f1f5f9', textDecoration: checked ? 'line-through' : 'none' }}>{text}</div>
            </div>
          );
        })}
      </div>

      <Particles color="#7dd3fc" count={50} seed={41} speed={0.6} minSize={2} maxSize={6} />

      <Caption title="RESOLUSI TAHUN BARU" subtitle="Target kecil, dicapai setiap hari" accent="#38bdf8" x={140} y={100} />
    </CameraStage>
  );
};
