"use client";

import { modes, notes } from "../constants";

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
      
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">STRINGS</h2>
        <input
          type="number"
          min={4}
          max={12}
          className="w-24 px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
          value={strings}
          onChange={(e) => setStrings(Number(e.target.value))}
        />
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">KEY</h2>
        <select
          className="px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={root}
          onChange={(e) => setRoot(String(e.target.value))}
        >
          {notes.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">FRETS</h2>
        <input
          type="number"
          min={5}
          max={36}
          className="w-24 px-4 py-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
          value={frets}
          onChange={(e) => setFrets(Number(e.target.value))}
        />
      </section>

      <section className="py-12 text-center">
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
