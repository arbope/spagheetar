"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenCheck, ArrowBigLeft, ArrowBigRight, EyeClosed } from "lucide-react";
import { notes, chords, getKeyShift, getNoteColor, getContrastingTextColor } from "../constants";
import { Scale, Note } from "tonal";

export interface ScaleChordPopupProps {
    tuning: string[];
    strings: number;
    root: string;
    mode: string;
    setRoot?: (root: string) => void;
    setMode?: (mode: string) => void;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    onClose?: () => void;
    onPreview?: (preview: { root: string; mode: string } | null) => void;
}

export default function ScaleChordPopup({
    tuning,
    strings,
    root,
    mode,
    setRoot,
    setMode,
    isOpen: controlledIsOpen,
    setIsOpen: controlledSetIsOpen,
    onClose,
    onPreview,
}: ScaleChordPopupProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const setIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === "function" ? value(isOpen) : value;
        if (controlledSetIsOpen) {
            controlledSetIsOpen(nextValue);
        } else {
            setInternalIsOpen(nextValue);
        }
        if (!nextValue && onClose) {
            onClose();
        }
    };

    const [chordRoot, setChordRoot] = useState<string>(root.toLowerCase());
    const [selectedChordType, setSelectedChordType] = useState<string>("major");
    const [positionIndex, setPositionIndex] = useState<number>(0);

    // Toggle & Preview states
    const [isPinned, setIsPinned] = useState<boolean>(false);
    const [isHoveringEye, setIsHoveringEye] = useState<boolean>(false);
    const [previousState, setPreviousState] = useState<{
        root: string;
        mode: string;
        chordRoot: string;
        selectedChordType: string;
    } | null>(null);

    const popupRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    // Close on outside click (unless pinned)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isPinned) return;
            const target = event.target as Node;
            if (iconRef.current?.contains(target)) return;
            if (popupRef.current && !popupRef.current.contains(target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isPinned]);

    // Ensure preview and hover states reset whenever the popup closes
    useEffect(() => {
        if (!isOpen) {
            setIsHoveringEye(false);
            onPreview?.(null);
        }
    }, [isOpen, onPreview]);

    // Get all notes belonging strictly to the current scale/mode via Tonal
    const scaleNotes = useMemo(() => {
        if (!root || !mode) return [root.toLowerCase()];
        try {
            const scaleData = Scale.get(`${root} ${mode}`);
            return scaleData.notes.map((n) => {
                const chroma = Note.chroma(n);
                return chroma !== undefined ? notes[chroma] : n.toLowerCase();
            });
        } catch {
            return [root.toLowerCase()];
        }
    }, [root, mode]);

    // Keep chordRoot synchronized and valid within the current scale's notes
    useEffect(() => {
        if (scaleNotes.length > 0 && !scaleNotes.includes(chordRoot)) {
            setChordRoot(scaleNotes[0]);
            setPositionIndex(0);
        }
    }, [scaleNotes, chordRoot]);

    // Compute Roman numeral indicator based on scale degree and chord quality
    const romanNumeral = useMemo(() => {
        const idx = scaleNotes.findIndex((n) => getKeyShift(n) % 12 === getKeyShift(chordRoot) % 12);
        if (idx === -1) return "";
        const baseNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        let numeral = baseNumerals[idx] || `${idx + 1}`;
        const lowerChord = selectedChordType.toLowerCase();
        const isMinor = lowerChord.includes("minor") || lowerChord === "m" || lowerChord.includes("m ") || lowerChord.includes("minor seventh");
        const isDim = lowerChord.includes("dim") || lowerChord.includes("diminished");
        if (isDim) numeral = numeral.toLowerCase() + "°";
        else if (isMinor) numeral = numeral.toLowerCase();
        return numeral;
    }, [scaleNotes, chordRoot, selectedChordType]);

    // Interval color relative to the main scale root
    const rootIntervalColor = useMemo(() => {
        return getNoteColor(chordRoot, root);
    }, [chordRoot, root]);

    // Filter available chord types
    const availableChordTypes = useMemo(() => {
        const rootPitchShift = getKeyShift(chordRoot);
        const matching: string[] = [];

        for (const [cName, intervals] of Object.entries(chords)) {
            const chordPitches = intervals.map((i) => (rootPitchShift + i) % 12);
            const allNotesInScale = chordPitches.every((pitch) => {
                return scaleNotes.some((scaleNote) => getKeyShift(scaleNote) % 12 === pitch);
            });

            if (allNotesInScale) {
                matching.push(cName);
            }
        }

        return matching.length > 0 ? matching : Object.keys(chords).slice(0, 5);
    }, [chordRoot, scaleNotes]);

    const chordsByCount = useMemo(() => {
        return availableChordTypes.reduce((acc, name) => {
            const intervals = chords[name] || [0, 4, 7];
            const count = intervals.length;
            if (!acc[count]) acc[count] = [];
            acc[count].push(name);
            return acc;
        }, {} as Record<number, string[]>);
    }, [availableChordTypes]);

    const sortedCounts = useMemo(() => {
        return Object.keys(chordsByCount).map(Number).sort((a, b) => a - b);
    }, [chordsByCount]);

    useEffect(() => {
        if (availableChordTypes.length > 0 && !availableChordTypes.includes(selectedChordType)) {
            setSelectedChordType(availableChordTypes[0]);
            setPositionIndex(0);
        }
    }, [availableChordTypes, selectedChordType]);

    const chordIntervals = useMemo(() => {
        return chords[selectedChordType] || [0, 4, 7];
    }, [selectedChordType]);

    const rootShift = getKeyShift(chordRoot);
    const chordSemis = useMemo(() => {
        return chordIntervals.map((i) => (rootShift + i) % 12);
    }, [rootShift, chordIntervals]);

    const positions = useMemo(() => {
        const validWindows: { start: number; end: number; notesOnStrings: (number | null)[] }[] = [];
        const seenSignatures = new Set<string>();
        const rootPitch = chordSemis[0];

        for (let start = 0; start <= 12; start++) {
            const end = start + 3;
            const stringNotes: (number | null)[] = Array(strings).fill(null);
            const presentNotes = new Set<number>();

            for (let s = 0; s < strings; s++) {
                const stringNoteShift = getKeyShift(tuning[s]);
                let bestFret: number | null = null;
                let bestScore = -1;

                const openPitch = stringNoteShift % 12;
                if (chordSemis.includes(openPitch)) {
                    bestFret = 0;
                    bestScore = openPitch === rootPitch ? 3.5 : 2.5;
                }

                for (let f = start; f <= end; f++) {
                    if (f === 0) continue;
                    const notePitch = (stringNoteShift + f) % 12;
                    if (chordSemis.includes(notePitch)) {
                        let score = 1;
                        if (notePitch === rootPitch) score = 3;
                        else if (notePitch === chordSemis[1]) score = 2;
                        else if (chordSemis.length > 2 && notePitch === chordSemis[2]) score = 1.5;

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

            for (let s = 0; s < strings; s++) {
                if (stringNotes[s] !== null) {
                    const pitch = (getKeyShift(tuning[s]) + (stringNotes[s] as number)) % 12;
                    if (pitch === rootPitch) {
                        for (let mutingS = 0; mutingS < s; mutingS++) {
                            stringNotes[mutingS] = null;
                        }
                        break;
                    }
                }
            }

            stringNotes.forEach((fret, s) => {
                if (fret !== null) {
                    presentNotes.add((getKeyShift(tuning[s]) + fret) % 12);
                }
            });

            const hasRoot = presentNotes.has(rootPitch);
            const minRequiredNotes = Math.min(chordSemis.length, 3);

            if (hasRoot && presentNotes.size >= minRequiredNotes) {
                const signature = stringNotes.join(",");
                if (!seenSignatures.has(signature)) {
                    seenSignatures.add(signature);
                    const playedFrets = stringNotes.filter((f) => f !== null && f !== 0) as number[];
                    let displayStart = 1;
                    let displayEnd = 4;
                    if (playedFrets.length > 0) {
                        const minF = Math.min(...playedFrets);
                        const maxF = Math.max(...playedFrets);
                        displayStart = Math.max(1, minF - 1);
                        displayEnd = Math.max(displayStart + 3, maxF);
                    }
                    validWindows.push({ start: displayStart, end: displayEnd, notesOnStrings: stringNotes });
                }
            }
        }

        if (validWindows.length === 0) {
            validWindows.push({ start: 1, end: 4, notesOnStrings: Array(strings).fill(null) });
        }
        return validWindows;
    }, [chordSemis, tuning, strings]);

    useEffect(() => {
        if (positionIndex >= positions.length) setPositionIndex(0);
    }, [positions.length, positionIndex]);

    const currentPos = positions[positionIndex] || positions[0];
    const startFret = currentPos.start;
    const endFret = currentPos.end;
    const numFretsInView = endFret - startFret + 1;

    // Eye Hover Preview Handlers
    const handleEyeMouseEnter = () => {
        if (isPinned) return;
        setIsHoveringEye(true);
        setPreviousState({ root, mode, chordRoot, selectedChordType });
        onPreview?.({ root: chordRoot, mode: selectedChordType });
    };

    const handleEyeMouseLeave = () => {
        if (isPinned) return;
        setIsHoveringEye(false);
        onPreview?.(null);
    };

    // Eye Click Pin & Commit Handler
    const handleEyeClick = () => {
        const nextPinned = !isPinned;
        setIsPinned(nextPinned);

        if (nextPinned) {
            setRoot?.(chordRoot);
            setMode?.(selectedChordType);
            onPreview?.(null);
            setIsHoveringEye(false);
        } else if (previousState) {
            setRoot?.(previousState.root);
            setMode?.(previousState.mode);
            setChordRoot(previousState.chordRoot);
            setSelectedChordType(previousState.selectedChordType);
            setPreviousState(null);
        }
    };

    return (
        <>
            <div
                ref={iconRef}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Open scale matching chords popup"
                className="text-2xl cursor-pointer transition-transform duration-700 transform hover:text-gray-800 z-10"
            >
                <BookOpenCheck size={36} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popupRef}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: isHoveringEye ? 0.05 : 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl z-50 w-80 text-black dark:text-white flex flex-col items-center gap-3"
                    >
                        {/* 1U Stable Top Header */}
                        <div className="flex w-full gap-2 items-center justify-between">
                            {/* Roman Numeral Box (1U) */}
                            <div
                                className="w-9 h-9 rounded-lg border border-black/20 dark:border-white/20 flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-sm"
                                style={{
                                    backgroundColor: rootIntervalColor,
                                    color: getContrastingTextColor(rootIntervalColor),
                                }}
                                title="Roman Numeral Degree"
                            >
                                {romanNumeral || "-"}
                            </div>

                            {/* Root Note Select */}
                            <select
                                value={chordRoot}
                                onChange={(e) => {
                                    setChordRoot(e.target.value);
                                    setPositionIndex(0);
                                    if (isPinned) setRoot?.(e.target.value);
                                }}
                                className="px-2.5 py-1.5 h-9 rounded-lg bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 text-sm font-bold focus:outline-none shrink-0"
                            >
                                {scaleNotes.map((n) => (
                                    <option key={n} value={n}>
                                        {n.toUpperCase()}
                                    </option>
                                ))}
                            </select>

                            {/* Chord Type Select */}
                            <select
                                value={selectedChordType}
                                onChange={(e) => {
                                    setSelectedChordType(e.target.value);
                                    setPositionIndex(0);
                                    if (isPinned) setMode?.(e.target.value);
                                }}
                                className="px-3 py-1.5 h-9 rounded-lg bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 text-sm font-semibold flex-1 focus:outline-none truncate"
                            >
                                {sortedCounts.map((count) => (
                                    <optgroup key={count} label={`${count} notes`}>
                                        {chordsByCount[count].map((cName) => (
                                            <option key={cName} value={cName}>
                                                {cName}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>

                            {/* Eye Preview / Pin Button */}
                            <button
                                onMouseEnter={handleEyeMouseEnter}
                                onMouseLeave={handleEyeMouseLeave}
                                onClick={handleEyeClick}
                                aria-label="Toggle preview and pin"
                                className={`w-9 h-9 rounded-lg border border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                                    isPinned
                                        ? "bg-blue-500/30 border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "bg-white/50 dark:bg-black/50 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                <EyeClosed size={18} />
                            </button>
                        </div>

                        {/* Fretboard Diagram Container */}
                        <div className="w-full bg-[#8c8e7b]/30 dark:bg-zinc-800/50 rounded-xl p-3 border border-black/10 dark:border-white/10 flex flex-col items-center">
                            <div className="flex w-full mb-1 pl-6 gap-1">
                                {Array.from({ length: strings }).map((_, sIdx) => {
                                    const actualSIdx = strings - 1 - sIdx;
                                    const note = tuning[actualSIdx];
                                    const playedFret = currentPos.notesOnStrings[actualSIdx];
                                    const isMuted = playedFret === null;
                                    const isNoteInChord = chordSemis.includes(getKeyShift(note) % 12);
                                    const textColor = isNoteInChord ? getNoteColor(note, root) : "#D1D5DB";

                                    return (
                                        <div
                                            key={sIdx}
                                            className={`h-7 flex-1 rounded-sm flex items-center justify-center text-xs font-bold shadow-sm transition-opacity ${
                                                isMuted ? "bg-gray-600/50 opacity-40" : "bg-gray-700 opacity-100"
                                            }`}
                                            style={{ color: textColor }}
                                        >
                                            {note.toUpperCase()}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="relative w-full flex flex-col pl-6">
                                <div className="h-1.5 w-full bg-black/80 dark:bg-white/80 mb-0.5 rounded-sm shadow-sm" />

                                {Array.from({ length: numFretsInView }).map((_, fretOffset) => {
                                    const actualFret = startFret + fretOffset;

                                    return (
                                        <div
                                            key={fretOffset}
                                            className="flex w-full h-8 border-b border-black/30 dark:border-white/30 relative"
                                        >
                                            <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-gray-700 dark:text-gray-300 w-6 text-center">
                                                {actualFret}
                                            </span>
                                            {Array.from({ length: strings }).map((_, sIdx) => {
                                                const actualSIdx = strings - 1 - sIdx;
                                                const playedFret = currentPos.notesOnStrings[actualSIdx];
                                                const isNoteHere = playedFret === actualFret;
                                                const stringNoteShift = getKeyShift(tuning[actualSIdx]);
                                                const noteName = notes[(stringNoteShift + actualFret) % 12];
                                                const bgColor = isNoteHere ? getNoteColor(noteName, root) : "transparent";
                                                const textColor = isNoteHere ? getContrastingTextColor(bgColor) : "transparent";

                                                return (
                                                    <div
                                                        key={sIdx}
                                                        className="flex-1 flex items-center justify-center border-r border-black/20 dark:border-white/20 last:border-r-0 relative"
                                                    >
                                                        {isNoteHere && (
                                                            <div
                                                                className="rounded-full h-5 w-5 text-xs font-normal flex items-center justify-center z-10 shadow-md"
                                                                style={{ backgroundColor: bgColor, color: textColor }}
                                                            >
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
