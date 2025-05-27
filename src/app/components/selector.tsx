"use client";

import { modes } from "../constants";

interface SelectionProps {
  strings: number;
  frets: number;
  mode: string;
  root: string;
  setFrets: (value: number) => void;
  setStrings: (value: number) => void;
  setMode: (value: keyof typeof modes) => void;
  setRoot: (value: string) => void;
}

export default function Selection({ strings, setStrings, frets, setFrets, mode, setMode, root, setRoot }: SelectionProps) {
  return (
    <div className="grid grid-cols-4">

      <section className="py-12 bg-purple-500 text-center">
        <h2 className="text-2xl font-semibold mb-4">STRINGS</h2>
        <select
          className="px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={strings}
          onChange={(e) => setStrings(Number(e.target.value))}
        >
          {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <option key={num} value={num}>
              {num} Strings
            </option>
          ))}
        </select>
      </section>

      <section className="py-12 bg-purple-500 text-center">
        <h2 className="text-2xl font-semibold mb-4">KEY</h2>
        <select
          className="px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={root}
          onChange={(e) => setRoot(String(e.target.value))}
        >
          {['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'].map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </section>

      <section className="py-12 bg-purple-500 text-center">
        <h2 className="text-2xl font-semibold mb-4">FRETS</h2>
        <select
          className="px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={frets}
          onChange={(e) => setFrets(Number(e.target.value))}
        >
          {Array.from({ length: 33 }, (_, i) => i + 5).map((num) => (
            <option key={num} value={num}>
              {num} Frets
            </option>
          ))}
        </select>
      </section>

      <section className="py-12 bg-purple-500 text-center">
        <h2 className="text-2xl font-semibold mb-4">MODE</h2>
        <select
          className="px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
          value={mode}
          onChange={(e) => setMode(e.target.value as keyof typeof modes)}
        >
          {Object.keys(modes).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </section>

    </div>
  );
}