'use client'
import React from 'react';
import Fretboard from './fretboard';
import StringTuner from './stringTuner';
import { modes } from '../constants';
import StringMuter from './stringMuter';

const GuitarApp = ({
  mode,
  root, setRoot,
  strings,
  frets,
  tuning, setTuning,
  customIntervals,
  toggleCustomInterval,
  detectionIntervals,
  toggleDetectionInterval,
  mutedStrings, setMutedStrings,
  mutedFrets, setMutedFrets
}: {
  mode: keyof typeof modes;
  setMode: React.Dispatch<React.SetStateAction<keyof typeof modes>>;
  root: string;
  setRoot: React.Dispatch<React.SetStateAction<string>>;
  strings: number;
  setStrings: React.Dispatch<React.SetStateAction<number>>;
  frets: number;
  setFrets: React.Dispatch<React.SetStateAction<number>>;
  tuning: string[];
  setTuning: React.Dispatch<React.SetStateAction<string[]>>;
  customIntervals: number[];
  toggleCustomInterval: (interval: number) => void;
  toggleDetectionInterval: (interval: number) => void;
  detectionIntervals: number[];
  mutedStrings: [number, number];
  setMutedStrings: React.Dispatch<React.SetStateAction<[number, number]>>;
  mutedFrets: [number, number];
  setMutedFrets: React.Dispatch<React.SetStateAction<[number, number]>>;
}) => {

  return (
    <div>
      <div className='flex justify-center max-h-[85vh] overflow-hidden'>
        <StringTuner
          root={root}
          mode={mode}
          strings={strings}
          tuning={tuning}
          setTuning={setTuning}
          customIntervals={customIntervals}
        />
        <Fretboard
          strings={strings}
          frets={frets}
          tuning={tuning}
          mode={mode}
          root={root} setRoot={setRoot}
          onToggleCustomInterval={toggleCustomInterval}
          customIntervals={customIntervals}
          onToggleDetectionInterval={toggleDetectionInterval}
          detectionIntervals={detectionIntervals}
          mutedStrings={mutedStrings}
          mutedFrets={mutedFrets} setMutedFrets={setMutedFrets}
        />
        <StringMuter
          strings={strings}
          mutedStrings={mutedStrings}
          setMutedStrings={setMutedStrings}
        />
      </div>
    </div>
  );
};

export default GuitarApp;
