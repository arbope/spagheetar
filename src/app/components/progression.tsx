"use client";

import React from "react";

interface ProgressionProps {
  bars: number;
  playing: boolean;
  tracking: number;
}

const Progression: React.FC<ProgressionProps> = ({
  bars,
  playing,
  tracking,
}) => {
  return (
    <div className="absolute top-50 left-1/2 -translate-x-1/2 text-2xl">
      {playing && (
        <div className="flex flex-row gap-1">
          {Array.from({ length: bars }).map((_, index) => (
            <div
              className={`w-[5vh] h-[5vh] rounded-sm ${
                index === tracking ? "bg-blue-500" : "bg-white"
              } hover:bg-gray-300`}
              key={index}
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
      )}
    </div>
  );
};

export default Progression;
