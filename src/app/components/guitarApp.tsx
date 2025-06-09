'use client'
import React from 'react';
import Fretboard from './fretboard';
import StringTuner from './stringTuner';
import { modes} from '../constants';

const GuitarApp = ({
  mode,
  root, setRoot,
  strings,
  frets,
  tuning, setTuning,
  customIntervals,
  toggleCustomInterval
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
}) => {

  return (
    <div>
      <div className='flex justify-center '>
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
        />
      </div>
    </div>
  );
};

export default GuitarApp;
