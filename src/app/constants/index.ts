export const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
export const notes2 = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', ' '];

export const modes = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    melodic: [0, 2, 3, 5, 7, 9, 11],
    harmonic: [0, 2, 3, 5, 7, 8, 11],
    blues: [0, 3, 5, 6, 7, 10],
    penta_maj: [0, 2, 4, 7, 9],
    penta_min: [0, 3, 5, 7, 10],
    bebop_maj: [0, 2, 4, 5, 7, 8, 9, 11],
    bebop_min: [0, 2, 3, 5, 7, 8, 9, 10],
    bebop_dom: [0, 2, 4, 5, 7, 9, 10, 11],
    arabic: [0, 1, 4, 5, 7, 8, 11],
    hung_min: [0, 2, 3, 6, 7, 8, 11],
    flamenco: [0, 1, 4, 5, 7, 8, 10],
    whole: [0, 2, 4, 6, 8, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    majChord: [0, 4, 7],        // 1 - 3 - 5
    minChord: [0, 3, 7],        // 1 - b3 - 5
    dimiChord: [0, 3, 6],   // 1 - b3 - b5
    augChord: [0, 4, 8],    // 1 - 3 - #5
    sus2Chord: [0, 2, 7],   // 1 - 2 - 5
    sus4Chord: [0, 5, 7],   // 1 - 4 - 5
    maj7Chord: [0, 4, 7, 11],         // 1 - 3 - 5 - 7
    dom7Chord: [0, 4, 7, 10],      // 1 - 3 - 5 - b7
    min7Chord: [0, 3, 7, 10],         // 1 - b3 - 5 - b7
    hlfDim7Chord: [0, 3, 6, 10],       // 1 - b3 - b5 - b7
    dimi7Chord: [0, 3, 6, 9],     // 1 - b3 - b5 - bb7
    minMaj7Chord: [0, 3, 7, 11],    // 1 - b3 - 5 - 7
    aug7Chord: [0, 4, 8, 10],  
    maj9Chord: [0, 4, 7, 11, 14],     // 1 - 3 - 5 - 7 - 9
    dom9Chord: [0, 4, 7, 10, 14],  // 1 - 3 - 5 - b7 - 9
    min9Chord: [0, 3, 7, 10, 14],     // 1 - b3 - 5 - b7 - 9
    maj11Chord: [0, 4, 7, 11, 14, 17],// 1 - 3 - 5 - 7 - 9 - 11
    min11Chord: [0, 3, 7, 10, 14, 17],// 1 - b3 - 5 - b7 - 9 - 11
    dom13Chord: [0, 4, 7, 10, 14, 21],
    add9Chord: [0, 4, 7, 14],       // 1 - 3 - 5 - 9
    add11Chord: [0, 4, 7, 17],
    maj7shrp11Chord: [0, 4, 7, 11, 18], // Lydian flavor
    dominant7flat5: [0, 4, 6, 10],
    dominant7sharp5: [0, 4, 8, 10],
    custom: [0]
};

export function getKeyShift(root: string | undefined | null): number {
    if (!root) return 0;
    const index = notes.indexOf(root.toLocaleLowerCase());
    return index >= 0 ? index : 0;
}

export const COLORS = [
    '#FF4136', // 0: Root (Red)
    '#FF851B', // 1: b2 (Dark Orange)
    '#FFB347', // 2: Major 2nd
    '#FFD700', // 3: Minor 3rd
    '#FFFF00', // 4: Major 3rd
    '#2ECC40', // 5: Perfect 4th (Green)
    '#ADFF2F', // 6: Tritone (Bright Green)
    '#0074D9', // 7: Perfect 5th (Blue)
    '#B10DC9', // 8: Minor 6th (Violet)
    '#DA70D6', // 9: Major 6th (Light Violet)
    '#D87093', // 10: Minor 7th (Soft Magenta)
    '#111111', // 11: Major 7th (Bright Black)
];

export const shortcodes = [
    "R",
    "b2",
    "M2",
    "m3",
    "M3",
    "P4",
    "TT",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
];

export const intervalNames = [
    'Root',         // 0
    'b2',           // 1
    'Major 2nd',    // 2
    'Minor 3rd',    // 3
    'Major 3rd',    // 4
    'Perfect 4th',  // 5
    'Tritone',      // 6
    'Perfect 5th',  // 7
    'Minor 6th',    // 8
    'Major 6th',    // 9
    'Minor 7th',    // 10
    'Major 7th',    // 11
];

export const getNoteColor = (note: string | null, root: string): string => {
    if (note === null) {
        return 'transparent';
    }
    const code = (getKeyShift(note) - getKeyShift(root) + 12) % 12;
    return COLORS[code];
};


export function getContrastingTextColor(bgColor: string) {
    // Remove hash if present
    const color = bgColor.charAt(0) === '#' ? bgColor.slice(1) : bgColor;
  
    const r = parseInt(color.slice(0, 2), 16); // Red
    const g = parseInt(color.slice(2, 4), 16); // Green
    const b = parseInt(color.slice(4, 6), 16); // Blue
  
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    return luminance > 0.5 ? 'black' : 'white';
  }