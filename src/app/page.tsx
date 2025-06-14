'use client';

import { RefreshCcw, Github } from 'lucide-react';
import Tuner from './components/tuner';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GuitarApp from './components/guitarApp';
import StyleSidebar from './components/styleSidebar';
import SettingsSidebar from './components/settingsSidebar';
import { COLORS, modes, notes, getKeyShift, DEF_COLORS } from './constants';

export default function Home() {
  const [stylesSidebarOpen, setStylesSidebarOpen] = useState(false);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [animatedBg, setAnimatedBg] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [activeBgPickerIndex, setActiveBgPickerIndex] = useState<number | null>(null);
  const [customIntervals, setCustomIntervals] = useState<number[]>([]);
  const [customColors, setCustomColors] = useState([...COLORS]);
  const [duration, setDuration] = useState(15);
  const [showTuner, setShowTuner] = useState(false);

  const [strings, setStrings] = useState<number>(() => {
    if (typeof window === 'undefined') return 6;
    const saved = localStorage.getItem('strings');
    return saved ? JSON.parse(saved) : 6;
  });

  const [frets, setFrets] = useState<number>(() => {
    if (typeof window === 'undefined') return 12;
    const saved = localStorage.getItem('frets');
    return saved ? JSON.parse(saved) : 12;
  });

  const [mode, setMode] = useState<keyof typeof modes>(() => {
    if (typeof window === 'undefined') return 'major';
    const saved = localStorage.getItem('mode');
    return saved ? JSON.parse(saved) : 'major';
  });

  const [root, setRoot] = useState<string>(() => {
    if (typeof window === 'undefined') return 'c';
    const saved = localStorage.getItem('root');
    return saved ? JSON.parse(saved) : 'c';
  });

  const [tuning, setTuning] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['e', 'b', 'g', 'd', 'a', 'e'];
    const saved = localStorage.getItem('tuning');
    return saved ? JSON.parse(saved) : ['e', 'b', 'g', 'd', 'a', 'e'];
  });

  useEffect(() => {
    localStorage.setItem('strings', JSON.stringify(strings));
  }, [strings]);

  useEffect(() => {
    localStorage.setItem('frets', JSON.stringify(frets));
  }, [frets]);

  useEffect(() => {
    localStorage.setItem('mode', JSON.stringify(mode));
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('root', JSON.stringify(root));
  }, [root]);

  useEffect(() => {
    localStorage.setItem('tuning', JSON.stringify(tuning));
  }, [tuning]);

  const body = typeof window !== 'undefined' ? document.documentElement : null;

  useEffect(() => {
    if (tuning.length < strings) {
      setTuning([
        ...tuning,
        ...Array(strings - tuning.length).fill(notes[(getKeyShift(tuning[tuning.length - 1]) - 5 + 12) % 12])
      ]);
    } else if (tuning.length > strings) {
      setTuning(tuning.slice(0, strings));
    }
  }, [strings, tuning]);

  const toggleCustomInterval = (interval: number) => {
    setCustomIntervals((prev) => {
      if (prev.includes(interval)) {
        return prev.filter(i => i !== interval);
      } else {
        return [...prev, interval];
      }
    });
  };

  const getCssVar = (name: string, fallback: string) =>
    body ? getComputedStyle(body).getPropertyValue(name).trim() || fallback : fallback;

  const [bgColors, setBgColors] = useState({
    first: getCssVar('--first-color', '#ff6ec4'),
    second: getCssVar('--second-color', '#7873f5'),
    third: getCssVar('--third-color', '#4ade80'),
  });

  const animationClass = animatedBg ? "animated-gradient-bg" : "";

  function updateColor(index: number, newColor: string) {
    const updated = [...customColors];
    COLORS[index] = newColor;
    setCustomColors(updated);
  }

  function resetColors() {
    for (let i = 0; i < COLORS.length - 1; i++) {
      COLORS[i] = DEF_COLORS[i];
    }
  }

  function updateBgColor(name: 'first' | 'second' | 'third', color: string) {
    if (!body) return;
    body.style.setProperty(`--${name}-color`, color);
    setBgColors(prev => ({ ...prev, [name]: color }));
  }

  function resetSettings() {
    localStorage.removeItem('strings');
    setStrings(6);
    localStorage.removeItem('frets');
    setFrets(12);
    localStorage.removeItem('mode');
    // setMode('major');
    localStorage.removeItem('root');
    setRoot('C');
    localStorage.removeItem('tuning');
    setTuning(['e', 'b', 'g', 'd', 'a', 'e']);
    setCustomIntervals([]);
    resetColors();
  }

  useEffect(() => {
    if (body && animatedBg) {
      body.style.setProperty('--duration', duration.toString());
    }
  }, [duration, animatedBg, body]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: animatedBg
          ? undefined
          : `linear-gradient(135deg, var(--first-color), var(--second-color), var(--third-color))`
      }}
      className={`${animationClass} flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]`}
    >

      <p className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl transform transition-all duration-1500 hover:translate-y-3 hover:text-black text-center">
        𝕾𝕻𝕬𝕲𝕳𝕰𝕰𝕿𝕬𝕽
      </p>

      <div className="absolute bottom-2 w-screen flex gap-3 justify-center items-center">
        <StyleSidebar
          stylesSidebarOpen={stylesSidebarOpen}
          setStylesSidebarOpen={setStylesSidebarOpen}
          activePickerIndex={activePickerIndex}
          setActivePickerIndex={setActivePickerIndex}
          activeBgPickerIndex={activeBgPickerIndex}
          setActiveBgPickerIndex={setActiveBgPickerIndex}
          customColors={customColors}
          setCustomColors={setCustomColors}
          bgColors={bgColors}
          setBgColors={setBgColors}
          animatedBg={animatedBg}
          setAnimatedBg={setAnimatedBg}
          duration={duration}
          setDuration={setDuration}
          updateColor={updateColor}
          updateBgColor={updateBgColor}
        />

        <SettingsSidebar
          strings={strings} setStrings={setStrings}
          frets={frets} setFrets={setFrets}
          mode={mode} setMode={setMode}
          root={root} setRoot={setRoot}
          settingsSidebarOpen={settingsSidebarOpen}
          setSettingsSidebarOpen={setSettingsSidebarOpen}
        />


        <button
          type="button"
          onClick={() => resetSettings()}
          aria-label="Reset settings"
          className="text-2xl cursor-pointer transition-transform duration-700 transform hover:-rotate-[180deg] hover:text-black hover:scale-110"
        >
          <RefreshCcw />
        </button>
        <a
          href="https://github.com/arbope/spagheetar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-center cursor-pointer transition-transform duration-700 transform hover:text-black hover:scale-110"
        >
          <Github />
        </a>

        <Tuner showTuner={showTuner} setShowTuner={setShowTuner} />
      </div>



      <div className="">
        <GuitarApp
          mode={mode} setMode={setMode}
          root={root} setRoot={setRoot}
          strings={strings} setStrings={setStrings}
          frets={frets} setFrets={setFrets}
          tuning={tuning} setTuning={setTuning}
          customIntervals={customIntervals}
          toggleCustomInterval={toggleCustomInterval}
        />
      </div>
    </motion.div>
  );
}
