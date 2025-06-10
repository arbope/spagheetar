'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { PaintbrushVertical } from 'lucide-react';
import { intervalNames, shortcodes, getContrastingTextColor, COLORS } from '../constants';
import { HexColorPicker } from 'react-colorful';
import { useEffect, useState } from 'react';

interface SidebarProps {
  stylesSidebarOpen: boolean;
  setStylesSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activePickerIndex: number | null;
  setActivePickerIndex: React.Dispatch<React.SetStateAction<number | null>>;
  activeBgPickerIndex: number | null;
  setActiveBgPickerIndex: React.Dispatch<React.SetStateAction<number | null>>;
  customColors: string[];
  setCustomColors: React.Dispatch<React.SetStateAction<string[]>>;
  bgColors: { first: string; second: string; third: string };
  setBgColors: React.Dispatch<React.SetStateAction<{ first: string; second: string; third: string }>>;
  animatedBg: boolean;
  setAnimatedBg: React.Dispatch<React.SetStateAction<boolean>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  updateColor: (index: number, newColor: string) => void;
  updateBgColor: (name: 'first' | 'second' | 'third', color: string) => void;
}

export default function StyleSidebar({
  stylesSidebarOpen,
  setStylesSidebarOpen,
  activePickerIndex,
  setActivePickerIndex,
  activeBgPickerIndex,
  setActiveBgPickerIndex,
  customColors,
  bgColors,
  setBgColors,
  updateColor,
  animatedBg,
  setAnimatedBg,
  duration,
  setDuration,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = minutes * 6 + seconds * 0.1; // 360 / 60 + extra
  const hourAngle = ((hours % 12) + minutes / 60) * 30; // 360 / 12

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (stylesSidebarOpen) {
          setStylesSidebarOpen(false);
          setActivePickerIndex(null);
          setActiveBgPickerIndex(null);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [stylesSidebarOpen, setStylesSidebarOpen, setActivePickerIndex, setActiveBgPickerIndex]);

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
        (!sidebarRef.current.contains(target))
      ) {
        setStylesSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePickerIndex,
    activeBgPickerIndex,
    setActivePickerIndex,
    setActiveBgPickerIndex,
    setStylesSidebarOpen,]);

  function updateBgColor(name: 'first' | 'second' | 'third', color: string) {
    setBgColors(prev => ({ ...prev, [name]: color }));
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(`--${name}-color`, color);
    }
  }

  return (
    <>
      <div
        onClick={() => setStylesSidebarOpen(prev => !prev)}
        className={`${stylesSidebarOpen ? 'hidden' : 'block'} absolute top-0 left-0 pt-2 pl-1 w-min h-min cursor-pointer duration-700 z-20 hover:text-black`}
      >
        <PaintbrushVertical />
      </div>

      <motion.div
        ref={sidebarRef}
        initial={{ x: -250 }}
        animate={{ x: stylesSidebarOpen ? 5 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 -left-2 h-full w-56 bg-transparent backdrop-blur-sm shadow-lg p-4 overflow-y-auto z-10 rounded-tr-lg rounded-br-lg"
      >
        <div className="relative w-[25vh] h-[25vh] mx-auto rounded-full">
          {intervalNames.map((name, i) => {
            const total = intervalNames.length;
            const angle = (i / total) * 2 * Math.PI;
            const radius = 45;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const bgColor = COLORS[i];
            const textColor = getContrastingTextColor(bgColor);

            return (
              <span
                key={name}
                className="absolute flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full cursor-pointer select-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  backgroundColor: bgColor,
                  color: textColor,
                }}
                title={name}
                onClick={() => {
                  setActivePickerIndex(prev => (prev === i ? null : i));
                  setActiveBgPickerIndex(null);
                }}
              >
                {shortcodes[i]}
              </span>
            );
          })}

          <div
            className="absolute left-1/2 top-1/2 w-[2px] h-[30%] bg-black origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-[1px] h-[40%] bg-black origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-[1px] h-[45%] origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
              backgroundColor: COLORS[0]
            }}
          />

        </div>


        <h2 className="text-lg font-bold mb-4 text-gray-950 text-center mt-4">Background</h2>

        <div className="flex flex-col gap-3 px-4 -mt-3">
          {(['first', 'second', 'third'] as const).map((key, idx) => (
            <label key={key} className="flex flex-col text-gray-900">
              <input
                type="text"
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
                className="w-full h-8 rounded border cursor-pointer text-center focus:outline focus:ring-1 focus:ring-black"
              />
            </label>
          ))}
        </div>

        <div className="mt-1 px-auto mx-auto py-2 flex justify-center">
          <button
            onClick={() => setAnimatedBg(prev => !prev)}
            className="text-black rounded border-1 border-black focus:ring-1 focus:ring-black-100 w-full"
          >
            {!animatedBg ? 'ANIMATE' : "ANIMATEN'T"}
          </button>
        </div>

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

        {(activePickerIndex !== null || activeBgPickerIndex !== null) && (
          <div
            ref={popupRef}
            className="mt-6 rounded-lg shadow-lg sticky bottom-4 left-1/2 transform  z-20"
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
      </motion.div>
    </>
  );
}
