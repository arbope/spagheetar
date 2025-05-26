'use client'
import React from 'react';
import { notes, modes, getKeyShift, getNoteColor, getContrastingTextColor } from '../constants';


interface FretboardProps {
    strings: number;
    frets: number;
    mode: keyof typeof modes;
    root: string;
    tuning: string[];
}

const Fretboard: React.FC<FretboardProps> = ({ strings, frets, mode, root, tuning }) => {

    const intervals = modes[mode] || modes['major'];

    const keyShift = getKeyShift(root);

    const calculateNote = (i: number, i2: number) => {
        let note;
        i = (i - keyShift + getKeyShift(tuning[i2]) + 1) % 12;
        if (i < 0) i += 12;
        if (intervals.includes(i)) {
            note = notes[(i + keyShift) % 12];
        } else {
            note = null;
        }
        return note;
    };

    return (
        <div className='h-min w-[65vw] mt-6'>
            {Array.from({ length: strings }).map((_, index) => (
                <div className="flex border-y-1 border-l-8 border-indigo-500 " key={index}>
                    {Array.from({ length: frets }).map((_, fretIndex) => (
                        <div
                            className="bg-[#989a87] h-7 border-x-1 border-indigo-500 flex items-center justify-center flex-1"
                            key={fretIndex}
                        >
                            {calculateNote(fretIndex, index) === null ?
                                null
                                :
                                <div
                                    className='rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-blue-950'
                                    style={{
                                        backgroundColor: getNoteColor(calculateNote(fretIndex, index), root),
                                        color: getContrastingTextColor(getNoteColor(calculateNote(fretIndex, index), root)),
                                    }}
                                >
                                    {calculateNote(fretIndex, index)}
                                </div>
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Fretboard;