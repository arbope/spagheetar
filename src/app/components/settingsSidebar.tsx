'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cog } from 'lucide-react';
import { modes, notes } from '../constants';

interface SidebarProps {
  settingsSidebarOpen: boolean;
  setSettingsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  strings: number;
  frets: number;
  mode: keyof typeof modes;
  root: string;
  setFrets: (value: number) => void;
  setStrings: (value: number) => void;
  setMode: React.Dispatch<React.SetStateAction<keyof typeof modes>>;
  setRoot: (value: string) => void;
}

export default function SettingsSidebar({
  strings, setStrings,
  frets, setFrets, mode,
  setMode, root, setRoot,
  settingsSidebarOpen,
  setSettingsSidebarOpen,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && settingsSidebarOpen) {
          setSettingsSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingsSidebarOpen, setSettingsSidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (settingsRef.current?.contains(target)){
        return;
      }
      
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        setSettingsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <>
      <div
        ref={settingsRef}
        onClick={() => setSettingsSidebarOpen(prev => !prev)}
        className="w-min h-min cursor-pointer transition-transform duration-700 transform hover:rotate-[360deg] hover:text-black hover:scale-110"
      >
        <Cog />
      </div>

      <motion.div
        ref={sidebarRef}
        initial={{ x: 250 }}
        animate={{ x: settingsSidebarOpen ? 0 : 250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 -right-2 h-full w-56 bg-transparent backdrop-blur-sm shadow-lg p-4 overflow-y-auto z-10 rounded-tl-lg rounded-bl-lg"
      >
        <div className="grid grid-rows-4 text-gray-950 h-full">

          <section className="py-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">STRINGS</h2>
            <input
              type="number"
              min={4}
              max={12}
              className="w-24 px-4 py-2 rounded border-1 border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black-100 text-center"
              value={strings}
              onChange={(e) => setStrings(Number(e.target.value))}
            />
          </section>

          <section className="py-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">KEY</h2>
            <select
              className="px-4 py-2 rounded border-1 border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black-100"
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

          <section className="py-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">FRETS</h2>
            <input
              type="number"
              min={5}
              max={36}
              className="w-24 px-4 py-2 rounded border-1 border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black-100 text-center"
              value={frets}
              onChange={(e) => setFrets(Number(e.target.value))}
            />
          </section>

          <section className="py-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">MODE</h2>
            <select
              className="px-4 py-2 rounded border-1 border-black shadow-sm focus:outline-none focus:ring-1 focus:ring-black-100 text-center"
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

      </motion.div>
    </>
  );
}
