'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GuitarApp from './components/guitarApp';
import { PaintbrushVertical } from 'lucide-react';
import { COLORS as DEFAULT_COLORS, intervalNames, shortcodes } from './constants';
import { HexColorPicker } from "react-colorful";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedBg, setAnimatedBg] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [activeBgPickerIndex, setActiveBgPickerIndex] = useState<number | null>(null);
  const [duration, setDuration] = useState(15);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const paintBrushRef = useRef<HTMLDivElement>(null);

  const root = typeof window !== 'undefined' ? document.documentElement : null;

  const [customColors, setCustomColors] = useState([...DEFAULT_COLORS]);
  
  const getCssVar = (name: string, fallback: string) =>
    root ? getComputedStyle(root).getPropertyValue(name).trim() || fallback : fallback;

  const [bgColors, setBgColors] = useState({
    first: getCssVar('--first-color', '#ff6ec4'),
    second: getCssVar('--second-color', '#7873f5'),
    third: getCssVar('--third-color', '#4ade80'),
  });

  const animationClass = animatedBg ? "animated-gradient-bg" : "";

  function updateColor(index: number, newColor: string) {
    const updated = [...customColors];
    DEFAULT_COLORS[index] = newColor;
    setCustomColors(updated);
  }

  function updateBgColor(name: 'first' | 'second' | 'third', color: string) {
    if (!root) return;
    root.style.setProperty(`--${name}-color`, color);
    setBgColors(prev => ({ ...prev, [name]: color }));
  }

  useEffect(() => {
    if (root && animatedBg) {
      root.style.setProperty('--duration', duration.toString());
    }
  }, [duration, animatedBg, root]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (popupRef.current && !popupRef.current.contains(target)) {
        setActivePickerIndex(null);
        setActiveBgPickerIndex(null);
      }

      if (
        activePickerIndex === null &&
        activeBgPickerIndex === null &&
        sidebarRef.current &&
        (!sidebarRef.current.contains(target) || paintBrushRef.current?.contains(target))
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePickerIndex, activeBgPickerIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: animatedBg
          ? undefined
          : `linear-gradient(135deg, var(--first-color), var(--second-color), var(--third-color))`
      }}
      className={`${animationClass} relative min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <div
        onClick={() => setSidebarOpen(prev => !prev)}
        className={`${sidebarOpen ? 'hidden' : 'block'} absolute top-0 left-0 pt-1 pl-1 w-min h-min cursor-pointer duration-700 z-20`}
      >
        <PaintbrushVertical />
      </div>

      <motion.div
        ref={sidebarRef}
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 5 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 -left-2 h-full w-64 bg-amber-50 backdrop-blur-sm shadow-lg p-4 overflow-y-auto z-10 rounded-tr-lg rounded-br-lg"
      >

        <div className="flex flex-col items-center w-full">
          <h2 className="text-lg font-bold mb-4 text-gray-950 text-center">Intervals</h2>
          <ul className="grid grid-cols-3 grid-rows-4 w-[28vh] h-[28vh] -mt-3 gap-4 text-gray-950 p-9 rounded-full border-1 border-black">
            {intervalNames.map((name, i) => (
              <li
                key={name}
                className="flex justify-center items-center cursor-pointer select-none"
                style={{ color: customColors[i] }}
              >
                <label
                  onClick={() => {
                    setActivePickerIndex(prev => (prev === i ? null : i));
                    setActiveBgPickerIndex(null);
                  }}
                  className="text-sm font-medium"
                  title={name}
                >
                  {shortcodes[i]}
                </label>
              </li>
            ))}
          </ul>

        </div>
        <h2 className="text-lg font-bold mb-4 text-gray-950 text-center mt-4">Background</h2>

        <div className="flex flex-col gap-3 px-4 -mt-3">
          {(['first', 'second', 'third'] as const).map((key, idx) => (
            <label key={key} className="flex flex-col text-gray-900">
              <input
                value={bgColors[key]}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setBgColors(prev => ({ ...prev, [key]: newValue }));
                }}
                onClick={() => {
                  setActiveBgPickerIndex(prev => (prev === idx ? null : idx));
                  setActivePickerIndex(null);
                }}
                style={{ backgroundColor: bgColors[key] }}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer text-center"
              />
            </label>
          ))}
        </div>
        <div className="mt-1 px-auto mx-auto py-2 flex justify-center">
          <button
            onClick={() => setAnimatedBg(prev => !prev)}
            className="text-black rounded border-1 border-black w-full"
          >
            {!animatedBg ? 'ANIMATE' : "ANIMATEN'T"}
          </button>
        </div>

        {(activePickerIndex !== null || activeBgPickerIndex !== null) && (
          <div
            ref={popupRef}
            className="mt-6 bg-white p-2 rounded-lg shadow-lg sticky bottom-4 left-1/2 transform  z-20"
          >
            <HexColorPicker
              color={
                activePickerIndex !== null
                  ? customColors[activePickerIndex]
                  : activeBgPickerIndex !== null
                    ? bgColors[(['first', 'second', 'third'] as const)[activeBgPickerIndex]]
                    : "#ffffff"
              }
              onChange={(color) => {
                if (activePickerIndex !== null) {
                  updateColor(activePickerIndex, color);
                } else if (activeBgPickerIndex !== null) {
                  const key = (['first', 'second', 'third'] as const)[activeBgPickerIndex];
                  updateBgColor(key, color);
                }
              }}
            />
          </div>
        )}

        {animatedBg && (
          <div className="">
            <h1 className="text-lg font-bold text-gray-950 text-center mt-3">Duration</h1>
            <div className="left-1/2 flex items-center gap-3 z-30 bg-transparent p-2 rounded -mt-4">
              <input
                id="duration-slider"
                type="range"
                min="5"
                max="120"
                step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="cursor-pointer w-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      <p className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl transform transition-all duration-1500 hover:translate-y-3 hover:text-black text-center">
        𝕾𝕻𝕬𝕲𝕳𝕰𝕰𝕿𝕬𝕽
      </p>

      <div className="relative z-0">
        <GuitarApp />
      </div>
    </motion.div>
  );
}
