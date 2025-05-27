'use client'
import React, { useState, useEffect } from 'react';
import Selection from './selector';
import Fretboard from './fretboard';
import StringTuner from './stringTuner';
import { getKeyShift, modes, notes } from '../constants';

const GuitarApp = () => {
    const [strings, setStrings] = useState(6);
    const [frets, setFrets] = useState(12);
    const [mode, setMode] = useState<keyof typeof modes>('major');
    const [root, setRoot] = useState('c');
    const [tuning, setTuning] = useState(['e','b','g','d','a','e']);

    const [customIntervals, setCustomIntervals] = useState<number[]>([]);

    useEffect(() => {
        if (tuning.length < strings) {
          setTuning([
            ...tuning,
            ...Array(strings - tuning.length).fill(notes[(getKeyShift(tuning[tuning.length -1]) - 5 + 12) % 12])
          ]);
        } else if (tuning.length > strings) {
          setTuning(tuning.slice(0, strings));
        }
      }, [strings]);

    const toggleCustomInterval = (interval: number) => {
        setCustomIntervals((prev) => {
            if (prev.includes(interval)) {
                return prev.filter(i => i !== interval);
            } else {
                return [...prev, interval];
            }
        });
    }

    return (
        <div>
            <Selection
                strings={strings} setStrings={setStrings}
                frets={frets} setFrets={setFrets}
                mode={mode} setMode={setMode}
                root={root} setRoot={setRoot}
            />
            <div className='flex'>
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
                    root={root}
                    onToggleCustomInterval={toggleCustomInterval}
                    customIntervals={customIntervals}
                />
            </div>
        </div>
    );
};

export default GuitarApp;
