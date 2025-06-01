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

  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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
    updated[index] = newColor;
    setCustomColors(updated);
  }

  function updateBgColor(name: 'first' | 'second' | 'third', color: string) {
    if (!root) return;
    root.style.setProperty(`--${name}-color`, color);
    setBgColors(prev => ({ ...prev, [name]: color }));
  }

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
        !sidebarRef.current.contains(target)
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
        className="absolute top-0 left-0 pt-1 pl-1 w-min h-min cursor-pointer duration-700 z-20"
      >
        <PaintbrushVertical />
      </div>

      <motion.div
        ref={sidebarRef}
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 5 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 -left-2 h-full w-64 bg-white/80 backdrop-blur-sm shadow-lg p-4 overflow-y-auto z-10"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-950 text-center">Interval Colors</h2>

        <ul className="grid grid-cols-3 grid-rows-4 w-[28vh] h-[28vh] ml-3 gap-4 text-gray-950 p-9 rounded-full border-1 border-black">
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

        <h2 className="text-lg font-bold mb-4 text-gray-950 text-center mt-4">Background Colors</h2>

        <div className="flex flex-col gap-3 px-4">
          {(['first', 'second', 'third'] as const).map((key, idx) => (
            <label key={key} className="flex flex-col text-gray-900">
              <input
                value={bgColors[key]}
                onClick={() => {
                  setActiveBgPickerIndex(prev => (prev === idx ? null : idx));
                  setActivePickerIndex(null);
                }}
                readOnly
                style={{ backgroundColor: bgColors[key] }}
                className="w-full h-8 rounded border border-gray-300 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <button
          onClick={() => setAnimatedBg(prev => !prev)}
          className="mt-4 px-auto mx-auto py-2 bg-gray-300 text-black rounded hover:bg-gray-500 transition"
        >
          ANIMATE!
        </button>
      </motion.div>

      <p className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl transform transition-all duration-1500 hover:translate-y-3 hover:text-black text-center">
        𝔖𝔓𝔄𝔊ℌ𝔈𝔈𝔗𝔄ℜ
      </p>

      <div className="relative z-0">
        <GuitarApp />
      </div>
    </motion.div>
  );
}
