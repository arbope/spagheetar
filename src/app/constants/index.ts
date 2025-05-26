export const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export const modes = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    melodic: [0, 2, 3, 5, 7, 9, 11],
    harmonic: [0, 2, 3, 5, 7, 8, 11],
    blues: [0, 3, 5, 6, 7, 10],
    penta_maj: [0, 2, 4, 7, 9],
    penta_min: [0, 3, 5, 7, 10],
    bebop_maj: [0, 2, 4, 5, 7, 8, 9, 11],
    bebop_dom: [0, 2, 4, 5, 7, 9, 10, 11],
    arabic: [0, 1, 4, 5, 7, 8, 11],
    hung_min: [0, 2, 3, 6, 7, 8, 11],
    flamenco: [0, 1, 4, 5, 7, 8, 10],
    whole: [0, 2, 4, 6, 8, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export function getKeyShift(root: string | undefined | null): number {
    if (!root) return 0;
    const index = notes.indexOf(root.toLowerCase());
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