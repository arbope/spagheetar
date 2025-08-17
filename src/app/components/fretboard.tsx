'use client'
import React, { useState } from 'react';
import { notes, modes, getKeyShift, getNoteColor, getContrastingTextColor, intervalNames } from '../constants';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface FretboardProps {
    strings: number;
    frets: number;
    mode: keyof typeof modes;
    root: string;
    setRoot: (value: string) => void;
    tuning: string[];
    onToggleCustomInterval?: (interval: number) => void;
    onToggleDetectionInterval?: (interval: number) => void;
    customIntervals: number[];
    detectionIntervals: number[];
    mutedStrings: [number, number];
    mutedFrets: [number, number];
    setMutedFrets: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const Fretboard: React.FC<FretboardProps> = ({
    strings, frets, mode, root, setRoot, tuning,
    onToggleCustomInterval,
    customIntervals,
    onToggleDetectionInterval,
    detectionIntervals,
    mutedStrings,
    mutedFrets,
    setMutedFrets
}) => {
    const [hoveredInterval, setHoveredInterval] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const intervals = mode === 'custom' ? customIntervals : mode === 'detection' ? detectionIntervals : modes[mode] || modes['major'];
    const keyShift = getKeyShift(root);

    const handleInput = (newRange: [number, number]) => {
        setMutedFrets(newRange);
    };

    const calculateInterval = (fret: number, stringIndex: number) => {
        const stringNoteShift = getKeyShift(tuning[stringIndex]);
        const interval = (fret - keyShift + stringNoteShift + 1 + 12) % 12;
        return interval;
    };

    const calculateNote = (interval: number) => {
        const note = intervals.includes(interval) ? notes[(interval + keyShift) % 12] : null;
        return note;
    };

    const handleFretClick = (fret: number, stringIndex: number) => {
        if (mode !== 'custom' && mode !== 'detection') return;
        if (!onToggleCustomInterval) return;
        if (!onToggleDetectionInterval) return;

        const interval = calculateInterval(fret, stringIndex);
        if (mode === 'custom') {
            if (customIntervals.length === 0) {
                const rawNote = notes[(interval + keyShift) % 12];
                setRoot(rawNote.toLowerCase());
                onToggleCustomInterval(0);
            } else {
                onToggleCustomInterval(interval);
            }
        } else {
            console.log('pepe')
            if (detectionIntervals.length === 0) {
                const rawNote = notes[(interval + keyShift) % 12];
                setRoot(rawNote.toLowerCase());
                onToggleDetectionInterval(0);
            } else {
                onToggleDetectionInterval(interval);
            }
        }
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

                        return (
                            <div
                                key={fretIndex}
                                className="bg-[#989a87] h-7 border-x-1 mx-[0.5px] border-transparent flex items-center justify-center flex-1 cursor-pointer hover:bg-[#7f81746a]"
                                onClick={() => handleFretClick(fretIndex, stringIndex)}
                                onMouseEnter={() => handleMouseEnter(fretIndex, stringIndex)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {
                                    (fretIndex >= mutedFrets[0] && fretIndex <= mutedFrets[1] - 1 && stringIndex >= mutedStrings[0] && stringIndex <= mutedStrings[1] - 1) && note ? (
                                        <div
                                            className='rounded-full h-4 w-4 text-xs flex items-center justify-center hover:bg-blue-950'
                                            style={{
                                                backgroundColor: bgColor,
                                                color: textColor,
                                            }}
                                        >
                                            {note}
                                        </div>
                                    ) : null
                                }
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
            <div className='ml-2 pt-2.5'>
                <RangeSlider
                    id="range-slider"
                    min={0}
                    max={frets}
                    step={1}
                    value={mutedFrets}
                    onInput={handleInput} />
            </div>
        </div>
    );
};

export default Fretboard;
