'use client'
import React, { useState } from 'react';
import { notes, modes, getKeyShift, getNoteColor, getContrastingTextColor, intervalNames } from '../constants';

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
        const stringNoteShift = getKeyShift(tuning[stringIndex]);
        const interval = (fret - keyShift + stringNoteShift + 1 + 12) % 12;
        console.log(`[IntervalCalc] Fret ${fret}, String ${stringIndex + 1}`);
        console.log(`  Tuning note: ${tuning[stringIndex]}`);
        console.log(`  String note shift: ${stringNoteShift}`);
        console.log(`  Root: ${root} -> keyShift: ${keyShift}`);
        console.log(`  Interval calculated: ${interval}`);
        return interval;
    };

    const calculateNote = (interval: number) => {
        const note = intervals.includes(interval) ? notes[(interval + keyShift) % 12] : null;
        console.log(`  -> Interval ${interval} ${intervals.includes(interval) ? 'IS' : 'IS NOT'} in scale [${intervals}]`);
        if (note) console.log(`  -> Note: ${note}`);
        return note;
    };

    const handleFretClick = (fret: number, stringIndex: number) => {
        if (mode !== 'custom' || !onToggleCustomInterval) return;
        const interval = calculateInterval(fret, stringIndex);
        onToggleCustomInterval(interval);
    };

    const handleMouseEnter = (fret: number, stringIndex: number) => {
        if (notes.includes(tuning[stringIndex])) {
            const interval = calculateInterval(fret, stringIndex);
            setHoveredInterval(interval);
        }
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
                        className="h-7 border-x-1 border-transparent flex items-center justify-center flex-1 font-bold"
                    >
                        {fretIndex + 1}
                    </div>
                ))}
            </div>
            {Array.from({ length: strings }).map((_, stringIndex) => (
                <div className="flex border-y-1 border-l-8 border-transparent" key={stringIndex}>
                    {Array.from({ length: frets }).map((_, fretIndex) => {
                        let interval: number | null = null;
                        let note: string | null = null;
                        if (notes.includes(tuning[stringIndex])) {
                            interval = calculateInterval(fretIndex, stringIndex);
                            note = calculateNote(interval);
                        }

                        const bgColor = note ? getNoteColor(note, root) : undefined;
                        const textColor = bgColor ? getContrastingTextColor(bgColor) : undefined;

                        if (note !== null) {
                            console.log(`[RENDER] Fret ${fretIndex}, String ${stringIndex + 1}`);
                            console.log(`  Note: ${note}, Interval: ${interval}`);
                            console.log(`  BG Color: ${bgColor}, Text Color: ${textColor}`);
                        }

                        return (
                            <div
                                key={fretIndex}
                                className="bg-[#989a87] h-7 border-x-1 mx-[0.5px] border-transparent flex items-center justify-center flex-1 cursor-pointer"
                                onClick={() => handleFretClick(fretIndex, stringIndex)}
                                onMouseEnter={() => handleMouseEnter(fretIndex, stringIndex)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {note === null ? null : (
                                    <div
                                        className='rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-blue-950'
                                        style={{
                                            backgroundColor: bgColor,
                                            color: textColor,
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
    