import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from 'remotion';
import { Background } from '../components/Background.jsx';
import { Particles } from '../components/Particles.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { clampTween } from '../components/Transitions.jsx';

// Hitung mundur 3-2-1 lalu ledakan partikel emas dan teks 2027
const DIGITS = ['3', '2', '1'];

const BURST_RAYS = Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2);

export const P01_Countdown = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fase hitung mundur: setiap angka tampil 30 frame (0-90)
  const digitIndex = Math.min(2, Math.floor(frame / 30));
  const digitLocal = frame - digitIndex * 30;
  const digitScale = spring({ frame: digitLocal, fps, config: { damping: 14, stiffness: 140 } });
  const digitOpacity = clampTween(digitLocal, [0, 6, 22, 30], [0, 1, 1, 0]);
  const showDigits = frame < 90;

  // Ledakan partikel dimulai di frame 90
  const burst = clampTween(frame, [90, 180], [0, 1], Easing.out(Easing.cubic));
  const burstFade = clampTween(frame, [90, 260], [1, 0]);
  const yearIn = spring({ frame: Math.max(0, frame - 92), fps, config: { damping: 16, stiffness: 120 } });
  const shimmer = ((frame * 6) % 1400) - 200;

  const subIn = clampTween(frame, [140, 180], [0, 1]);

  return (
    <CameraStage background="#07050a" zoom={[0.94, 1.06]} rotateY={[-4, 4]} perspective={2200}>
      <Background base="#07050a" glowA="rgba(250,204,21,0.20)" glowB="rgba(251,146,60,0.14)" gridColor="rgba(250,204,21,0.05)" />

      {/* Ledakan sinar emas */}
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        {BURST_RAYS.map((a, i) => {
          const r0 = 60 + burst * 240;
          const r1 = r0 + 160 * burst;
          return (
            <line
              key={`ray-${i}`}
              x1={DESIGN_W / 2 + Math.cos(a) * r0}
              y1={DESIGN_H / 2 + Math.sin(a) * r0}
              x2={DESIGN_W / 2 + Math.cos(a) * r1}
              y2={DESIGN_H / 2 + Math.sin(a) * r1}
              stroke={i % 2 ? '#fde68a' : '#fbbf24'}
              strokeWidth={6}
              strokeLinecap="round"
              opacity={burstFade * (burst > 0 ? 1 : 0)}
            />
          );
        })}
        <circle cx={DESIGN_W / 2} cy={DESIGN_H / 2} r={20 + burst * 420} fill="none" stroke="#fde68a" strokeWidth={4} opacity={burstFade * 0.6} />
      </svg>

      {/* Angka hitung mundur */}
      {showDigits && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 260,
            width: DESIGN_W,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 900,
            fontSize: 360,
            color: '#fde68a',
            opacity: digitOpacity,
            transform: `scale(${0.6 + 0.4 * digitScale})`,
            textShadow: '0 0 60px rgba(251,191,36,0.8)',
          }}
        >
          {DIGITS[digitIndex]}
        </div>
      )}

      {/* Tahun 2027 dengan kilau yang bergerak */}
      {frame >= 90 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 300,
            width: DESIGN_W,
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 900,
            fontSize: 360,
            letterSpacing: 10,
            opacity: clampTween(yearIn, [0, 1], [0, 1]),
            transform: `scale(${0.7 + 0.3 * yearIn})`,
            background: `linear-gradient(100deg, #b45309 ${shimmer / 14}%, #fde68a ${shimmer / 14 + 8}%, #fbbf24 ${shimmer / 14 + 16}%, #b45309 ${shimmer / 14 + 26}%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          2027
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 720,
          width: DESIGN_W,
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 700,
          fontSize: 60,
          letterSpacing: 14,
          color: '#fef3c7',
          opacity: subIn * clampTween(frame, [560, 630], [1, 0]),
        }}
      >
        SELAMAT TAHUN BARU
      </div>

      <Particles color="#fde68a" count={120} seed={7} speed={1.4} minSize={3} maxSize={10} />
    </CameraStage>
  );
};
