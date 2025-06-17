"use client";

import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { modes } from "../constants";

interface AutoplaySettingsProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  bars: number;
  setBars: (bars: number) => void;
  tempo: string;
  setTempo: (tempo: string) => void;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<keyof typeof modes>>;
  autoplaySettingsOpen: boolean;
  setAutoplaySettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const tempoOptions = ["4/4", "3/4", "7/8", "6/8", "5/4"];

export default function AutoplaySettings({
  bpm,
  setBpm,
  bars,
  setBars,
  tempo,
  setTempo,
  mode,
  setMode,
  autoplaySettingsOpen,
  setAutoplaySettingsOpen,
  playing,
  setPlaying,
}: AutoplaySettingsProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (iconRef.current?.contains(target)) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setAutoplaySettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setAutoplaySettingsOpen]);

  return (
    <>
      <div
        ref={iconRef}
        onClick={() => setAutoplaySettingsOpen((prev) => !prev)}
        aria-label="Open autoplay"
        className="text-2xl cursor-pointer transition-transform duration-700 transform hover:text-gray-800"
      >
        <Play />
      </div>

      {autoplaySettingsOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md rounded-lg shadow-lg z-50 w-full max-w-6xl flex flex-col gap-y-4 px-6 py-4"
        >
          {/* Top row: Settings panel */}
          <div className="flex flex-row gap-x-8 justify-center flex-wrap">
            {/* Left column */}
            <div className="flex flex-col gap-y-4">
              <div>
                <label htmlFor="bpm" className="block font-medium mb-1">
                  BPM: <span>{bpm}</span>
                </label>
                <input
                  id="bpm"
                  type="range"
                  min={40}
                  max={340}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-48"
                />
              </div>

              <div>
                <label htmlFor="bars" className="block font-medium mb-1">
                  Cycle Length (bars): <span>{bars}</span>
                </label>
                <input
                  id="bars"
                  type="range"
                  min={0}
                  max={32}
                  value={bars}
                  onChange={(e) => setBars(Number(e.target.value))}
                  className="w-48"
                />
              </div>
            </div>

            {/* Middle column */}
            <div className="flex flex-col gap-y-4">
              <div>
                <label htmlFor="tempo" className="block font-medium mb-1">
                  Tempo Signature:
                </label>
                <select
                  id="tempo"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="w-48 border border-gray-300 rounded px-2 py-1"
                >
                  {tempoOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preset-mode" className="block font-medium mb-1">
                  Presets:
                </label>
                <select
                  id="preset-mode"
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as keyof typeof modes)
                  }
                  className="w-48 border border-gray-300 rounded px-2 py-1"
                >
                  {["1", "2", "3"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-y-4">
              <div>
                <label htmlFor="key-mode" className="block font-medium mb-1">
                  Key:
                </label>
                <select
                  id="key-mode"
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as keyof typeof modes)
                  }
                  className="w-48 border border-gray-300 rounded px-2 py-1"
                >
                  {Object.keys(modes).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input id="countIn" type="checkbox" className="w-4 h-4 mr-2" />
                <label
                  htmlFor="countIn"
                  className="font-medium select-none cursor-pointer"
                >
                  Count-in before bars
                </label>
              </div>
            </div>

            {/* Play/Stop Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPlaying((prev) => !prev);
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                {!playing ? "Play" : "Stop"}
              </button>
            </div>
          </div>

          {/* Bottom row: Progression */}
          <div className="flex flex-row gap-2 justify-center overflow-x-auto w-full">
            {Array.from({ length: bars }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-[5vh] h-[5vh] rounded-sm bg-blue-500 hover:bg-gray-300"
              >
                <select className="text-xs mt-1 appearance-none">
                  <option value="">None</option>
                  <option value="kick">Kick</option>
                  <option value="snare">Snare</option>
                  <option value="hat">Hi-Hat</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
