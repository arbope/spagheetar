'use client'
import React, { useState, useEffect } from 'react';
import Selection from './selector';
import Fretboard from './fretboard';
import StringTuner from './stringTuner';
import { getKeyShift, modes, notes } from '../constants';

const GuitarApp = () => {
    const [strings, setStrings] = useState<number>(() => {
        if (typeof window === 'undefined') return 6;
        const saved = localStorage.getItem('strings');
        return saved ? JSON.parse(saved) : 6;
    });

    const [frets, setFrets] = useState<number>(() => {
        if (typeof window === 'undefined') return 12;
        const saved = localStorage.getItem('frets');
        return saved ? JSON.parse(saved) : 12;
    });

    const [mode, setMode] = useState<keyof typeof modes>(() => {
        if (typeof window === 'undefined') return 'major';
        const saved = localStorage.getItem('mode');
        return saved ? JSON.parse(saved) : 'major';
    });

    const [root, setRoot] = useState<string>(() => {
        if (typeof window === 'undefined') return 'c';
        const saved = localStorage.getItem('root');
        return saved ? JSON.parse(saved) : 'c';
    });

    const [tuning, setTuning] = useState<string[]>(() => {
        if (typeof window === 'undefined') return ['e','b','g','d','a','e'];
        const saved = localStorage.getItem('tuning');
        return saved ? JSON.parse(saved) : ['e','b','g','d','a','e'];
    });

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
    }, [strings,tuning]);

    useEffect(() => {
      localStorage.setItem('strings', JSON.stringify(strings));
    }, [strings]);

    useEffect(() => {
      localStorage.setItem('frets', JSON.stringify(frets));
    }, [frets]);

    useEffect(() => {
      localStorage.setItem('mode', JSON.stringify(mode));
    }, [mode]);

    useEffect(() => {
      localStorage.setItem('root', JSON.stringify(root));
    }, [root]);

    useEffect(() => {
      localStorage.setItem('tuning', JSON.stringify(tuning));
    }, [tuning]);

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
