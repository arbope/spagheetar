import { ScaleType, Interval, ChordType } from "tonal";

export const modes: Record<string, number[]> = Object.fromEntries([
  ...ScaleType.names().map((name) => [
    name,
    ScaleType.get(name).intervals.map((interval) =>
      Interval.semitones(interval),
    ),
  ]),
  ["custom", [0]],
  ["detection", [0]],
]);

export const chords: Record<string, number[]> = Object.fromEntries([
  ...ChordType.names().map((name) => [
    name,
    ChordType.get(name).intervals.map((interval) =>
      Interval.semitones(interval),
    ),
  ]),
]);

export const notes = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
];
export const notes2 = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
  " ",
];

export function getKeyShift(root: string | undefined | null): number {
  if (!root) return 0;
  const index = notes.indexOf(root.toLocaleLowerCase());
  return index >= 0 ? index : 0;
}

export const COLORS = [
  "#FF4136", // 0: Root (Red)
  "#FF851B", // 1: b2 (Dark Orange)
  "#FFB347", // 2: Major 2nd
  "#FFD700", // 3: Minor 3rd
  "#FFFF00", // 4: Major 3rd
  "#2ECC40", // 5: Perfect 4th (Green)
  "#ADFF2F", // 6: Tritone (Bright Green)
  "#0074D9", // 7: Perfect 5th (Blue)
  "#B10DC9", // 8: Minor 6th (Violet)
  "#DA70D6", // 9: Major 6th (Light Violet)
  "#D87093", // 10: Minor 7th (Soft Magenta)
  "#111111", // 11: Major 7th (Bright Black)
];

export const DEF_COLORS = [
  "#FF4136", // 0: Root (Red)
  "#FF851B", // 1: b2 (Dark Orange)
  "#FFB347", // 2: Major 2nd
  "#FFD700", // 3: Minor 3rd
  "#FFFF00", // 4: Major 3rd
  "#2ECC40", // 5: Perfect 4th (Green)
  "#ADFF2F", // 6: Tritone (Bright Green)
  "#0074D9", // 7: Perfect 5th (Blue)
  "#B10DC9", // 8: Minor 6th (Violet)
  "#DA70D6", // 9: Major 6th (Light Violet)
  "#D87093", // 10: Minor 7th (Soft Magenta)
  "#111111", // 11: Major 7th (Bright Black)
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
  "Root", // 0
  "b2", // 1
  "Major 2nd", // 2
  "Minor 3rd", // 3
  "Major 3rd", // 4
  "Perfect 4th", // 5
  "Tritone", // 6
  "Perfect 5th", // 7
  "Minor 6th", // 8
  "Major 6th", // 9
  "Minor 7th", // 10
  "Major 7th", // 11
];

export const getNoteColor = (note: string | null, root: string): string => {
  if (note === null) {
    return "transparent";
  }
  const code = (getKeyShift(note) - getKeyShift(root) + 12) % 12;
  return COLORS[code];
};

export function getContrastingTextColor(bgColor: string) {
  const color = bgColor.charAt(0) === "#" ? bgColor.slice(1) : bgColor;

  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}

export function frequencyToNoteName(frequency: number): string | null {
  if (frequency <= 0) return null;

  const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);

  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  const noteName = notes[noteIndex];
  return `${noteName}${octave}`;
}
