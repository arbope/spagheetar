"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenText, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { notes, chords, getKeyShift, getNoteColor, getContrastingTextColor } from "../constants";
import { Chord } from "tonal";

interface ChordPopupProps {
    tuning: string[];
    strings: number;
}

export default function ChordPopup({ tuning, strings }: ChordPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [chordRoot, setChordRoot] = useState<string>("c");
    const [chordType, setChordType] = useState<string>("major");
    const [positionIndex, setPositionIndex] = useState<number>(0);

    const popupRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (iconRef.current?.contains(target)) return;
            if (popupRef.current && !popupRef.current.contains(target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const chordsByCount = useMemo(() => {
        return Object.entries(chords).reduce((acc, [name, intervals]) => {
            const count = intervals.length;
            if (!acc[count]) acc[count] = [];
            acc[count].push(name);
            return acc;
        }, {} as Record<number, string[]>);
    }, []);

    const sortedCounts = useMemo(() => {
        return Object.keys(chordsByCount).map(Number).sort((a, b) => a - b);
    }, [chordsByCount]);

    const chordIntervals = chords[chordType] || [0, 4, 7];
    const rootShift = getKeyShift(chordRoot);
    const chordSemis = useMemo(() => {
        return chordIntervals.map((i) => (rootShift + i) % 12);
    }, [rootShift, chordIntervals]);

    const chordInfo = useMemo(() => {
        const tonalData = Chord.get(chordType);
        if (tonalData && tonalData.intervals && tonalData.intervals.length > 0) {
            return tonalData.intervals.join(" - ");
        }
        return chordIntervals.join(", ");
    }, [chordType, chordIntervals]);

    // --- IMPROVED ALGORITHM ---
    const positions = useMemo(() => {
        const validWindows: { start: number; end: number; notesOnStrings: (number | null)[] }[] = [];
        const seenSignatures = new Set<string>();
        const rootPitch = chordSemis[0];

        // Search common playable fret windows (0 to 12 covers the full octave standard shapes)
        for (let start = 0; start <= 12; start++) {
            const end = start + 3; // Standard 4-fret span for a human hand
            const stringNotes: (number | null)[] = Array(strings).fill(null);
            const presentNotes = new Set<number>();

            // 1. Find the best notes per string
            for (let s = 0; s < strings; s++) {
                const stringNoteShift = getKeyShift(tuning[s]);
                let bestFret: number | null = null;
                let bestScore = -1;

                // Value Open Strings highly for natural, ringing voicings
                const openPitch = stringNoteShift % 12;
                if (chordSemis.includes(openPitch)) {
                    bestFret = 0;
                    // Score open strings very high so they're preferred over stretching
                    bestScore = openPitch === rootPitch ? 3.5 : 2.5; 
                }

                // Check fretted notes within this 4-fret window
                for (let f = start; f <= end; f++) {
                    if (f === 0) continue; // 0 handled above

                    const notePitch = (stringNoteShift + f) % 12;
                    if (chordSemis.includes(notePitch)) {
                        let score = 1;
                        if (notePitch === rootPitch) score = 3; // Root note is top priority
                        else if (notePitch === chordSemis[1]) score = 2; // Third is important
                        else if (chordSemis.length > 2 && notePitch === chordSemis[2]) score = 1.5; // Fifth

                        if (score > bestScore) {
                            bestScore = score;
                            bestFret = f;
                        }
                    }
                }
                
                if (bestFret !== null) {
                    stringNotes[s] = bestFret;
                }
            }

            // 2. Musically constrain the chord: Mute strings below the lowest Root note
            let rootFound = false;
            for (let s = 0; s < strings; s++) {
                if (stringNotes[s] !== null) {
                    const pitch = (getKeyShift(tuning[s]) + stringNotes[s]) % 12;
                    if (pitch === rootPitch) {
                        rootFound = true;
                        // Mute all strings lower than our bass root note
                        for (let mutingS = 0; mutingS < s; mutingS++) {
                            stringNotes[mutingS] = null;
                        }
                        break;
                    }
                }
            }

            // 3. Register notes actually present after muting
            stringNotes.forEach((fret, s) => {
                if (fret !== null) {
                    presentNotes.add((getKeyShift(tuning[s]) + fret) % 12);
                }
            });

            // 4. Validate and Deduplicate
            const hasRoot = presentNotes.has(rootPitch);
            const minRequiredNotes = Math.min(chordSemis.length, 3);

            // A valid shape must have the root and enough chord tones to actually represent the chord
            if (hasRoot && presentNotes.size >= minRequiredNotes) {
                const signature = stringNotes.join(",");
                
                if (!seenSignatures.has(signature)) {
                    seenSignatures.add(signature);

                    // Dynamically calculate tight UI window boundaries
                    const playedFrets = stringNotes.filter(f => f !== null && f !== 0) as number[];
                    let displayStart = 1;
                    let displayEnd = 4;
                    
                    if (playedFrets.length > 0) {
                        const minF = Math.min(...playedFrets);
                        const maxF = Math.max(...playedFrets);
                        displayStart = Math.max(1, minF - 1); // Start slightly before the lowest fret played
                        displayEnd = Math.max(displayStart + 3, maxF); // Ensure at least a 4 fret window
                    }

                    validWindows.push({ start: displayStart, end: displayEnd, notesOnStrings: stringNotes });
                }
            }
        }

        // Fallback for empty/impossible shapes
        if (validWindows.length === 0) {
            validWindows.push({ start: 1, end: 4, notesOnStrings: Array(strings).fill(null) });
        }
        
        return validWindows;
    }, [chordSemis, tuning, strings, rootShift]);

    useEffect(() => {
        if (positionIndex >= positions.length) setPositionIndex(0);
    }, [positions.length, positionIndex]);

    const currentPos = positions[positionIndex] || positions[0];
    const startFret = currentPos.start;
    const endFret = currentPos.end;
    const numFretsInView = endFret - startFret + 1;

    return (
        <>
            <div ref={iconRef} onClick={() => setIsOpen((prev) => !prev)} className="text-2xl cursor-pointer transition-transform duration-700 transform hover:text-gray-800 z-10">
                <BookOpenText size={36} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div ref={popupRef} className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl z-50 w-80 text-black dark:text-white flex flex-col items-center gap-3">
                        {/* Dropdowns Header */}
                        <div className="flex w-full gap-2 justify-between">
                            <select value={chordRoot} onChange={(e) => { setChordRoot(e.target.value); setPositionIndex(0); }} className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 text-sm font-bold focus:outline-none">
                                {notes.map((n) => <option key={n} value={n}>{n.toUpperCase()}</option>)}
                            </select>
                            <select value={chordType} onChange={(e) => { setChordType(e.target.value); setPositionIndex(0); }} className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 text-sm font-semibold truncate max-w-[160px] focus:outline-none">
                                {sortedCounts.map((count) => (
                                    <optgroup key={count} label={`${count} Intervals`}>
                                        {chordsByCount[count].map((cName) => <option key={cName} value={cName}>{cName}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {/* Fretboard Diagram Container */}
                        <div className="w-full bg-[#8c8e7b]/30 dark:bg-zinc-800/50 rounded-xl p-3 border border-black/10 dark:border-white/10 flex flex-col items-center">
                            
                            {/* String Tuning Headers */}
                            <div className="flex w-full mb-1 pl-6 gap-1">
                                {Array.from({ length: strings }).map((_, sIdx) => {
                                    const actualSIdx = strings - 1 - sIdx;
                                    const note = tuning[actualSIdx];
                                    const playedFret = currentPos.notesOnStrings[actualSIdx];
                                    
                                    // Dim strings that are muted for better UI
                                    const isMuted = playedFret === null;
                                    const isNoteInChord = chordSemis.includes(getKeyShift(note) % 12);
                                    const textColor = isNoteInChord ? getNoteColor(note, chordRoot) : "#D1D5DB";

                                    return (
                                        <div 
                                            key={sIdx} 
                                            className={`h-7 flex-1 rounded-sm flex items-center justify-center text-xs font-bold uppercase shadow-sm transition-opacity ${isMuted ? 'bg-gray-600/50 opacity-40' : 'bg-gray-700 opacity-100'}`}
                                            style={{ color: textColor }}
                                        >
                                            {note}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Fret Grid */}
                            <div className="relative w-full flex flex-col pl-6">
                                <div className="h-1.5 w-full bg-black/80 dark:bg-white/80 mb-0.5 rounded-sm shadow-sm" />

                                {Array.from({ length: numFretsInView }).map((_, fretOffset) => {
                                    const actualFret = startFret + fretOffset;

                                    return (
                                        <div key={fretOffset} className="flex w-full h-8 border-b border-black/30 dark:border-white/30 relative">
                                            <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-gray-700 dark:text-gray-300 w-6 text-center">
                                                {actualFret}
                                            </span>
                                            {Array.from({ length: strings }).map((_, sIdx) => {
                                                const actualSIdx = strings - 1 - sIdx;
                                                const playedFret = currentPos.notesOnStrings[actualSIdx];
                                                const isNoteHere = playedFret === actualFret;
                                                
                                                const stringNoteShift = getKeyShift(tuning[actualSIdx]);
                                                const noteName = notes[(stringNoteShift + actualFret) % 12];
                                                const bgColor = isNoteHere ? getNoteColor(noteName, chordRoot) : "transparent";
                                                const textColor = isNoteHere ? getContrastingTextColor(bgColor) : "transparent";
                                                
                                                return (
                                                    <div key={sIdx} className="flex-1 flex items-center justify-center border-r border-black/20 dark:border-white/20 last:border-r-0 relative">
                                                        {isNoteHere && (
                                                            <div className="rounded-full h-5 w-5 text-[10px] font-bold flex items-center justify-center z-10 shadow-md" style={{ backgroundColor: bgColor, color: textColor }}>
                                                                {noteName}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Position Navigation */}
                        <div className="flex items-center justify-center gap-3 bg-black/5 dark:bg-white/5 py-2 px-4 rounded-xl w-full">
                            <button 
                                onClick={() => setPositionIndex((p) => (p - 1 + positions.length) % positions.length)} 
                                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
                                aria-label="Previous position"
                                disabled={positions.length <= 1}
                            >
                                <ArrowBigLeft size={24} />
                            </button>
                            <span className="text-sm font-semibold tracking-wide font-mono min-w-[90px] text-center">
                                Pos <span className="text-base font-black">{positionIndex + 1}</span> / {positions.length}
                            </span>
                            <button 
                                onClick={() => setPositionIndex((p) => (p + 1) % positions.length)} 
                                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
                                aria-label="Next position"
                                disabled={positions.length <= 1}
                            >
                                <ArrowBigRight size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
