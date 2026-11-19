import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Background } from '../components/Background.jsx';
import { CameraStage, DESIGN_W, DESIGN_H } from '../components/Camera.jsx';
import { Caption, Label, useIntro } from '../components/Transitions.jsx';

// Infografis jaringan saraf: lapisan node dengan sinyal yang mengalir di setiap koneksi
const LAYERS = [4, 6, 6, 3];
const LAYER_X = [360, 760, 1160, 1560];
const NAMES = ['INPUT', 'TERSEMBUNYI', 'TERSEMBUNYI', 'OUTPUT'];

const nodes = LAYERS.flatMap((count, li) =>
  Array.from({ length: count }, (_, ni) => ({
    li,
    ni,
    x: LAYER_X[li],
    y: 580 + (ni - (count - 1) / 2) * 110,
  }))
);

const edges = [];
for (let li = 0; li < LAYERS.length - 1; li++) {
  const from = nodes.filter((n) => n.li === li);
  const to = nodes.filter((n) => n.li === li + 1);
  from.forEach((a) => to.forEach((b) => edges.push({ a, b, key: `${li}-${a.ni}-${b.ni}`, idx: edges.length })));
}

export const P06_AINetwork = () => {
  const frame = useCurrentFrame();
  const intro = useIntro();

  return (
    <CameraStage background="#050914" zoom={[0.95, 1.06]} rotateY={[-6, 6]} perspective={2400}>
      <Background base="#050914" glowA="rgba(34,211,238,0.18)" glowB="rgba(168,85,247,0.14)" gridColor="rgba(34,211,238,0.04)" />

      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={DESIGN_W} height={DESIGN_H} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}>
        {edges.map((e) => (
          <g key={e.key}>
            <line x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke="rgba(56,189,248,0.22)" strokeWidth={2} opacity={intro} />
            <line
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              stroke="#67e8f9"
              strokeWidth={4}
              pathLength={100}
              strokeDasharray="8 92"
              strokeDashoffset={-((frame * 2.2 + e.idx * 7) % 100)}
              opacity={intro}
            />
          </g>
        ))}
        {nodes.map((n, i) => {
          const pulse = 0.5 + 0.5 * Math.sin(frame / 14 - n.li * 1.2 + n.ni * 0.6);
          return (
            <g key={`n-${i}`} opacity={intro}>
              <circle cx={n.x} cy={n.y} r={44 + pulse * 6} fill="rgba(34,211,238,0.12)" />
              <circle cx={n.x} cy={n.y} r={26} fill="#0c4a6e" stroke="#67e8f9" strokeWidth={4} />
              <circle cx={n.x} cy={n.y} r={10 + pulse * 4} fill="#a5f3fc" />
            </g>
          );
        })}
      </svg>

      {NAMES.map((name, i) => (
        <Label key={name} text={name} x={LAYER_X[i] - 150} y={196} color="#a5f3fc" delay={20 + i * 12} width={120} />
      ))}

      <Caption title="JARINGAN SARAF AI" subtitle="Input · Lapisan tersembunyi · Output" accent="#22d3ee" x={140} y={40} titleSize={64} />
    </CameraStage>
  );
};
