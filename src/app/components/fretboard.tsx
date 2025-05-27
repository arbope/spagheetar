'use client'
import React from 'react';
import { notes, modes, getKeyShift, getNoteColor, getContrastingTextColor } from '../constants';

interface FretboardProps {
    strings: number;
    frets: number;
    mode: keyof typeof modes;
    root: string;
    tuning: string[];
    onToggleCustomInterval?: (interval: number) => void;
    customIntervals: number[];
}

const Fretboard: React.FC<FretboardProps> = ({
    strings, frets, mode, root, tuning,
    onToggleCustomInterval,
    customIntervals
}) => {

    const intervals = mode === 'custom' ? customIntervals : modes[mode] || modes['major'];

    const keyShift = getKeyShift(root);

    const calculateNote = (fret: number, stringIndex: number) => {
        let noteIndex = (fret - keyShift + getKeyShift(tuning[stringIndex]) + 1) % 12;
        if (noteIndex < 0) noteIndex += 12;

        if (intervals.includes(noteIndex)) {
            return notes[(noteIndex + keyShift) % 12];
        }
        return null;
    };

    const handleFretClick = (fret: number, stringIndex: number) => {
        if (mode !== 'custom' || !onToggleCustomInterval) return;

        let interval = (fret - keyShift + getKeyShift(tuning[stringIndex]) + 1) % 12;
        if (interval < 0) interval += 12;
        onToggleCustomInterval(interval);
    };

    return (
        <div className='h-min w-[65vw] mt-6'>
            <div className="flex ml-1.5 ">
                {Array.from({ length: frets }).map((_, fretIndex) => (
                    <div
                        key={fretIndex}
                        className="h-7 border-x-1 border-transparent flex items-center justify-center flex-1"
                    >
                        {fretIndex + 1}
                    </div>
                ))}
            </div>
            {Array.from({ length: strings }).map((_, stringIndex) => (
                <div className="flex border-y-1 border-l-8 border-indigo-500" key={stringIndex}>
                    {Array.from({ length: frets }).map((_, fretIndex) => {
                        const note = calculateNote(fretIndex, stringIndex);
                        return (
                            <div
                                key={fretIndex}
                                className="bg-[#989a87] h-7 border-x-1 border-indigo-500 flex items-center justify-center flex-1 cursor-pointer"
                                onClick={() => handleFretClick(fretIndex, stringIndex)}
                            >
                                {note === null ? null : (
                                    <div
                                        className='rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-blue-950'
                                        style={{
                                            backgroundColor: getNoteColor(note, root),
                                            color: getContrastingTextColor(getNoteColor(note, root)),
                                        }}
                                    >
                                        {note}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Fretboard;
