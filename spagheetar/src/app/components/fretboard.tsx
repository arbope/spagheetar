'use client'
import React from 'react';

interface FretboardProps {
    strings: number;
    frets: number;
    mode: string;
    root: string;
    tuning: string[];
}

const Fretboard: React.FC<FretboardProps> = ({ strings, frets, mode, root, tuning }) => {
    var intervals = [0, 2, 4, 5, 7, 9, 11];
    var keyShift = 0;
    const MAJOR = [0, 2, 4, 5, 7, 9, 11];
    const MINOR_MEL = [0, 2, 3, 5, 7, 9, 11];
    const MINOR_HAR = [0, 2, 3, 5, 7, 8, 11];
    const MINOR = [0, 2, 3, 5, 7, 8, 10];
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    switch (mode) {
        case 'maj':
            intervals = MAJOR;
            break;
        case 'min':
            intervals = MINOR;
            break;
        case 'mel':
            intervals = MINOR_MEL;
            break;
        case 'har':
            intervals = MINOR_HAR;
            break;
        default:
            intervals = MAJOR;
            break;
    }
    switch (root) {
        case 'c':
            keyShift = 0;
            break;
        case 'c#':
            keyShift = 1;
            break;
        case 'd':
            keyShift = 2;
            break;
        case 'd#':
            keyShift = 3;
            break;
        case 'e':
            keyShift = 4;
            break;
        case 'f':
            keyShift = 5;
            break;
        case 'f#':
            keyShift = 6;
            break;
        case 'g':
            keyShift = 7;
            break;
        case 'g#':
            keyShift = 8;
            break;
        case 'a':
            keyShift = 9;
            break;
        case 'a#':
            keyShift = 10;
            break;
        case 'b':
            keyShift = 11;
            break;
        default:
            keyShift = 0;
            break;
    }
    const shift = (t: string) => {
        var shft;
        switch (t) {
            case 'c':
                shft = 0;
                break;
            case 'c#':
                shft = 1;
                break;
            case 'd':
                shft = 2;
                break;
            case 'd#':
                shft = 3;
                break;
            case 'e':
                shft = 4;
                break;
            case 'f':
                shft = 5;
                break;
            case 'f#':
                shft = 6;
                break;
            case 'g':
                shft = 7;
                break;
            case 'g#':
                shft = 8;
                break;
            case 'a':
                shft = 9;
                break;
            case 'a#':
                shft = 10;
                break;
            case 'b':
                shft = 11;
                break;
            default:
                shft = 0;
                break;
        }
        return shft;
    };
    const calculateNote = (i: number, i2: number) => {
        var note;
        i = (i - keyShift + shift(tuning[i2]) + 1) % 12;
        if (i < 0) i += 12;
        if (intervals.includes(i)) {
            note = notes[(i + keyShift) % 12];
        } else {
            note = null;
        }
        return note;
    };

    return (
        <div className='h-min w-[65vw]'>
            {Array.from({ length: strings }).map((_, index) => (
                <div className="flex border-y-1 border-l-8 border-indigo-500 " key={index}>
                    {Array.from({ length: frets }).map((_, fretIndex) => (
                        <div
                            className="bg-[#DEF131] h-7 border-x-1 border-indigo-500 flex items-center justify-center flex-1"
                            key={fretIndex}
                        >
                            {calculateNote(fretIndex,index) === null ?
                                null
                                :
                                <div className=' bg-indigo-400 rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-blue-950'>
                                    {calculateNote(fretIndex,index)}
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