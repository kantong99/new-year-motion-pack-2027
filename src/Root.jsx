import React from 'react';
import { Composition } from 'remotion';
import { DURATION, FPS } from './components/Transitions.jsx';
import { P01_Countdown } from './projects/P01_Countdown.jsx';
import { P02_Confetti } from './projects/P02_Confetti.jsx';
import { P03_Calendar } from './projects/P03_Calendar.jsx';
import { P04_Checklist } from './projects/P04_Checklist.jsx';
import { P05_Connection } from './projects/P05_Connection.jsx';
import { P06_AINetwork } from './projects/P06_AINetwork.jsx';
import { P07_Renewable } from './projects/P07_Renewable.jsx';
import { P08_LowerThird } from './projects/P08_LowerThird.jsx';
import { P09_LightLeak } from './projects/P09_LightLeak.jsx';
import { P10_Lantern } from './projects/P10_Lantern.jsx';

// Komposisi final 4K. Mode preview memakai override --width/--height saat render.
const WIDTH = 3840;
const HEIGHT = 2160;

// ID hanya boleh berisi a-z, A-Z, 0-9 dan tanda hubung (-)
export const COMPOSITIONS = [
  { id: 'P01-Countdown', component: P01_Countdown },
  { id: 'P02-Confetti', component: P02_Confetti },
  { id: 'P03-Calendar', component: P03_Calendar },
  { id: 'P04-Checklist', component: P04_Checklist },
  { id: 'P05-Connection', component: P05_Connection },
  { id: 'P06-AINetwork', component: P06_AINetwork },
  { id: 'P07-Renewable', component: P07_Renewable },
  { id: 'P08-LowerThird', component: P08_LowerThird },
  { id: 'P09-LightLeak', component: P09_LightLeak },
  { id: 'P10-Lantern', component: P10_Lantern },
];

export const RemotionRoot = () => (
  <>
    {COMPOSITIONS.map(({ id, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
