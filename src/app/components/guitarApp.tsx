'use client'
import React, { useState } from 'react';
import Selection from './selector';
import Fretboard from './fretboard';
import StringTuner from './stringTuner';

const GuitarApp = () => {
    const [strings, setStrings] = useState(6);
    const [frets, setFrets] = useState(12);
    const [mode, setMode] = useState('major');
    const [root, setRoot] = useState('c');
    const [tuning, setTuning] = useState(['e','b','g','d','a','e']);

    return (
        <div>
            <Selection strings={strings} setStrings={setStrings} frets={frets} setFrets={setFrets} mode={mode} setMode={setMode}  root={root} setRoot={setRoot} />
            <div className='flex'>
                <StringTuner strings={strings} tuning={tuning} setTuning={setTuning}/>
                <Fretboard strings={strings} frets={frets} tuning={tuning} mode={mode} root={root} />
            </div>
        </div>
    );
};

export default GuitarApp;