'use client'
import React, { useState } from 'react';
import { notes, modes, getKeyShift, getNoteColor, getContrastingTextColor, intervalNames    } from '../constants';

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

    const [hoveredInterval, setHoveredInterval] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const intervals = mode === 'custom' ? customIntervals : modes[mode] || modes['major'];
    const keyShift = getKeyShift(root);

    const calculateInterval = (fret: number, stringIndex: number) => {
        let interval = (fret - keyShift + getKeyShift(tuning[stringIndex]) + 1) % 12;
        if (interval < 0) interval += 12;
        return interval;
    };

    const calculateNote = (interval: number) => {
        return intervals.includes(interval) ? notes[(interval + keyShift) % 12] : null;
    };

    const handleFretClick = (fret: number, stringIndex: number) => {
        if (mode !== 'custom' || !onToggleCustomInterval) return;
        const interval = calculateInterval(fret, stringIndex);
        onToggleCustomInterval(interval);
    };

    const handleMouseEnter = (fret: number, stringIndex: number) => {
        const interval = calculateInterval(fret, stringIndex);
        setHoveredInterval(interval);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredInterval(null);
    };

    return (
        <div className='h-min w-[75vw] mt-6 relative'>
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
                        const interval = calculateInterval(fretIndex, stringIndex);
                        const note = calculateNote(interval);

                        return (
                            <div
                                key={fretIndex}
                                className="bg-[#989a87] h-7 border-x-1 border-indigo-500 flex items-center justify-center flex-1 cursor-pointer"
                                onClick={() => handleFretClick(fretIndex, stringIndex)}
                                onMouseEnter={() => handleMouseEnter(fretIndex, stringIndex)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
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

            {hoveredInterval !== null && (
                <div
                    className="absolute px-2 py-1 rounded text-sm text-white bg-gray-800"
                    style={{
                        left: mousePos.x + 10,
                        top: mousePos.y + 10,
                        opacity: 0.6,
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        position: 'fixed',
                        zIndex: 50,
                    }}
                >
                    {intervalNames[hoveredInterval]}
                </div>
            )}
        </div>
    );
};

export default Fretboard;
