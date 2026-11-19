import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Jaringan orang abstrak yang saling terhubung saat berdekatan, dengan kata kunci per huruf
const COLS = 6;
const ROWS = 4;
const PEOPLE = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    bx: 380 + c * 220,
    by: 260 + r * 180,
    ph: i * 0.73,
    amp: 26 + (i % 3) * 8,
  };
});

const WORD = 'BERSAMA';
const WORD2 = 'TERHUBUNG';
const LINK_DIST = 260;

export const P05_Connection = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pos = PEOPLE.map((p) => ({
    x: p.bx + Math.sin(frame / 40 + p.ph) * p.amp,
    y: p.by + Math.cos(frame / 47 + p.ph * 1.3) * p.amp,
  }));
  const linkAlpha = clampTween(frame, [60, 120], [0, 1]);

  const links = [];
  for (let i = 0; i < pos.length; i++) {
    for (let j = i + 1; j < pos.length; j++) {
      const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
      if (d < LINK_DIST) {
        links.push({ a: pos[i], b: pos[j], k: `${i}-${j}`, op: (1 - d / LINK_DIST) * linkAlpha });
      }
    }
  }

  const word1Chars = WORD.split('');
  const word2Chars = WORD2.split('');

  return (
    <CameraStage background="#0b0b1f" zoom={[1.0, 0.96]} rotateY={[-3, 3]} perspective={2400}>
      <Background base="#0b0b1f" glowA="rgba(251,113,133,0.16)" glowB="rgba(129,140,248,0.16)" gridColor="rgba(129,140,248,0.04)" />

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        {links.map((l) => (
          <line key={l.k} x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke="rgba(165,180,252,0.9)" strokeWidth={3} opacity={l.op * 0.8} />
        ))}
        {pos.map((p, i) => {
          const appear = spring({ frame: Math.max(0, frame - i * 3), fps, config: { damping: 18 } });
          const hue = i % 2 ? '#fda4af' : '#a5b4fc';
          return (
            <g key={`p-${i}`} opacity={appear} transform={`translate(${p.x} ${p.y}) scale(${0.4 + 0.6 * appear})`}>
              {/* Kepala dan badan sederhana */}
              <circle cx={0} cy={-26} r={18} fill={hue} />
              <path d="M -26 30 Q -26 2 0 2 Q 26 2 26 30 Z" fill={hue} opacity={0.85} />
            </g>
          );
        })}
      </svg>

      {/* Kata kunci dengan huruf yang muncul berurutan */}
      <div style={{ position: 'absolute', left: 0, top: 80, width: DESIGN_W, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 40, letterSpacing: 16, color: '#fda4af' }}>
        {word1Chars.map((ch, i) => {
          const s = spring({ frame: Math.max(0, frame - 14 - i * 4), fps, config: { damping: 14 } });
          return <span key={`w1-${i}`} style={{ display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>{ch}</span>;
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 960, width: DESIGN_W, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 56, letterSpacing: 10, color: '#f8fafc' }}>
        {word2Chars.map((ch, i) => {
          const s = spring({ frame: Math.max(0, frame - 300 - i * 4), fps, config: { damping: 14 } });
          return <span key={`w2-${i}`} style={{ display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>{ch}</span>;
        })}
      </div>
    </CameraStage>
  );
};
