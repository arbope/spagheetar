"use client";

import { RefreshCcw, Github, AudioLines } from "lucide-react";
import Tuner from "./components/tuner";
import ChordPopup from "./components/chords";
import ScaleChordsPopup from "./components/scaleChords";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import GuitarApp from "./components/guitarApp";
import { Scale, Interval, Note } from "tonal";
import StyleSidebar from "./components/styleSidebar";
import SnowFlake from "./components/snowFlake";
import SettingsSidebar from "./components/settingsSidebar";
import { COLORS, modes, notes, getKeyShift, DEF_COLORS } from "./constants";

const NUM_STRING_SLIDERS = 2;
const NUM_FRET_SLIDERS = 2;

export default function Home() {
	const [mounted, setMounted] = useState(false);

	// --- 1. UI & SIDEBAR STATE ---
	const [stylesSidebarOpen, setStylesSidebarOpen] = useState(false);
	const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
	const [animatedBg, setAnimatedBg] = useState(false);
	const [activePickerIndex, setActivePickerIndex] = useState<number | null>(
		null,
	);
	const [activeBgPickerIndex, setActiveBgPickerIndex] = useState<number | null>(
		null,
	);
	const [showTuner, setShowTuner] = useState(false);
	const [duration, setDuration] = useState(15);
	const [detectedScales, setDetectedScales] = useState<string[]>([]);
	const [previewScale, setPreviewScale] = useState<{
		root: string;
		mode: string;
	} | null>(null);

	// --- 2. CORE GUITAR CONFIGURATION ---
	const [strings, setStrings] = useState<number>(6);
	const [frets, setFrets] = useState<number>(12);
	const [mode, setMode] = useState<string>("major");
	const [root, setRoot] = useState<string>("c");
	const [tuning, setTuning] = useState<string[]>([
		"e",
		"b",
		"g",
		"d",
		"a",
		"e",
	]);

	// --- 3. INTERVALS & COLORS ---
	const [customIntervals, setCustomIntervals] = useState<number[]>([]);
	const [detectionIntervals, setDetectionIntervals] = useState<number[]>([]);
	const [customColors, setCustomColors] = useState<string[]>([...COLORS]);

	// --- 4. SELECTION & MUTING STATE ---
	const [sliderRanges, setSliderRanges] = useState<[number, number][]>(
		Array.from({ length: NUM_STRING_SLIDERS }, () => [0, 6]),
	);
	const [mutedFrets, setMutedFrets] = useState<[number, number][]>(
		Array.from({ length: NUM_FRET_SLIDERS }, () => [0, 12]),
	);

	const [bgColors, setBgColors] = useState({
		first: "#034f1b",
		second: "#bd3634",
		third: "#ceac5c",
	});

	// Hydrate from localStorage and DOM styles after mount
	useEffect(() => {
		setMounted(true);

		const savedStrings = localStorage.getItem("strings");
		const savedFrets = localStorage.getItem("frets");
		const savedMode = localStorage.getItem("mode");
		const savedRoot = localStorage.getItem("root");
		const savedTuning = localStorage.getItem("tuning");

		if (savedStrings) setStrings(JSON.parse(savedStrings));
		if (savedFrets) setFrets(JSON.parse(savedFrets));
		if (savedMode) setMode(JSON.parse(savedMode));
		if (savedRoot) setRoot(JSON.parse(savedRoot));
		if (savedTuning) setTuning(JSON.parse(savedTuning));

		const rootStyles = getComputedStyle(document.documentElement);
		setBgColors({
			first: rootStyles.getPropertyValue("--first-color").trim() || "#034f1b",
			second: rootStyles.getPropertyValue("--second-color").trim() || "#bd3634",
			third: rootStyles.getPropertyValue("--third-color").trim() || "#ceac5c",
		});
	}, []);

	// --- 5. DERIVED STATE ---
	const activeStrings = useMemo(() => {
		const nextActive = Array(strings).fill(false);
		sliderRanges.forEach(([min, max]) => {
			for (let i = Math.floor(min); i < Math.ceil(max); i++) {
				if (i >= 0 && i < strings) nextActive[i] = true;
			}
		});
		return nextActive;
	}, [sliderRanges, strings]);

	// --- 6. PERSISTENCE & BOUNDS SYNC ---
	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("mode", JSON.stringify(mode));
	}, [mode, mounted]);

	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("root", JSON.stringify(root));
	}, [root, mounted]);

	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("tuning", JSON.stringify(tuning));
	}, [tuning, mounted]);

	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("strings", JSON.stringify(strings));
		setSliderRanges((prev) =>
			prev.map(([min, max]) => [
				Math.min(min, strings),
				max >= strings - 1 || max === 0 ? strings : Math.min(max, strings),
			]),
		);
	}, [strings, mounted]);

	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem("frets", JSON.stringify(frets));
		setMutedFrets((prev) =>
			prev.map(([min, max]) => [
				Math.min(min, frets),
				max >= frets - 1 || max === 0 ? frets : Math.min(max, frets),
			]),
		);
	}, [frets, mounted]);

	useEffect(() => {
		setTuning((prev) => {
			if (prev.length === strings) return prev;
			if (prev.length < strings) {
				const diff = strings - prev.length;
				const lastNote = prev[prev.length - 1] || "e";
				const newNotes = Array(diff).fill(
					notes[(getKeyShift(lastNote) - 5 + 12) % 12],
				);
				return [...prev, ...newNotes];
			}
			return prev.slice(0, strings);
		});
	}, [strings]);

	useEffect(() => {
		if (animatedBg) {
			document.documentElement.style.setProperty(
				"--duration",
				duration.toString(),
			);
		}
	}, [duration, animatedBg]);

	// --- 7. HANDLERS ---
	const handleSliderChange = (index: number, newRange: [number, number]) => {
		setSliderRanges((prev) => {
			const next = [...prev];
			next[index] = newRange;
			return next;
		});
	};

	const handleFretSliderChange = (
		index: number,
		newRange: [number, number],
	) => {
		setMutedFrets((prev) => {
			const next = [...prev];
			next[index] = newRange;
			return next;
		});
	};

	const parseScale = (scaleName: string) => {
		const parts = scaleName.split(" ");
		return {
			root: parts[0].toLowerCase(),
			mode: parts.slice(1).join(" "),
		};
	};

	const toggleCustomInterval = (interval: number) => {
		setCustomIntervals((prev) =>
			prev.includes(interval)
				? prev.filter((i) => i !== interval)
				: [...prev, interval],
		);
	};

	const toggleDetectionInterval = (interval: number) => {
		setDetectionIntervals((prev) => {
			const next = prev.includes(interval)
				? prev.filter((i) => i !== interval)
				: [...prev, interval];

			if (mode === "detection" && next.length > 0) {
				const notesInSet = next.map((i) =>
					Note.transpose(root, Interval.fromSemitones(i)),
				);
				const distinctNotes = [
					...new Set(notesInSet.map((n) => Note.get(n).pc)),
				];

				let allMatches: string[] = [];
				distinctNotes.forEach((tonic) => {
					const matches = Scale.detect(notesInSet, { tonic });
					allMatches = [...allMatches, ...matches];
				});

				setDetectedScales([...new Set(allMatches)]);
			} else {
				setDetectedScales([]);
			}
			return next;
		});
	};

	const handleSelectDetectedScale = (scaleName: string) => {
		const { root: newRoot, mode: newMode } = parseScale(scaleName);
		setRoot(newRoot);
		setMode(newMode);
		setDetectionIntervals([]);
		setDetectedScales([]);
	};

	function updateColor(index: number, newColor: string) {
		setCustomColors((prev) => {
			const next = [...prev];
			next[index] = newColor;
			return next;
		});
	}

	function resetColors() {
		setCustomColors([...DEF_COLORS]);
	}

	function updateBgColor(name: "first" | "second" | "third", color: string) {
		document.documentElement.style.setProperty(`--${name}-color`, color);
		setBgColors((prev) => ({ ...prev, [name]: color }));
	}

	function resetSettings() {
		localStorage.removeItem("strings");
		localStorage.removeItem("frets");
		localStorage.removeItem("mode");
		localStorage.removeItem("root");
		localStorage.removeItem("tuning");

		setStrings(6);
		setFrets(12);
		setMode("major");
		setRoot("c");
		setTuning(["e", "b", "g", "d", "a", "e"]);
		setCustomIntervals([]);
		setDetectionIntervals([]);
		resetColors();
		setAnimatedBg(false);
		setSliderRanges(Array.from({ length: NUM_STRING_SLIDERS }, () => [0, 6]));
		setMutedFrets(Array.from({ length: NUM_FRET_SLIDERS }, () => [0, 12]));
	}

	const animationClass = animatedBg ? "animated-gradient-bg" : "";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{
				background: animatedBg
					? undefined
					: `linear-gradient(135deg, var(--first-color), var(--third-color), var(--second-color))`,
			}}
			className={`${animationClass} flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]`}
		>
			<SnowFlake enabled={animatedBg} />

			<p className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl transform transition-all duration-1500 hover:translate-y-3 hover:text-black text-center select-none">
				𝕾𝕻𝕬𝕲𝕳𝕰𝕰𝕿𝕬𝕽
			</p>

			<div className="absolute bottom-2 w-screen flex gap-3 justify-center items-center z-10">
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

				<a
					href="https://github.com/arbope/spagheetar"
					target="_blank"
					rel="noopener noreferrer"
					className="text-2xl text-center cursor-pointer transition-transform duration-700 transform hover:text-gray-800 z-10"
				>
					<Github size={36} />
				</a>

				<button
					type="button"
					onClick={resetSettings}
					aria-label="Reset settings"
					className="text-2xl cursor-pointer transition-transform duration-700 transform hover:-rotate-[180deg] hover:text-gray-800 z-10"
				>
					<RefreshCcw size={36} />
				</button>

				<Tuner showTuner={showTuner} setShowTuner={setShowTuner} />

				<ChordPopup
					tuning={tuning}
					strings={strings}
					root={root}
					mode={mode}
					setRoot={setRoot}
					setMode={setMode}
					onPreview={(preview) => setPreviewScale(preview)}
				/>

				<ScaleChordsPopup
					tuning={tuning}
					strings={strings}
					root={root}
					mode={mode}
					setRoot={setRoot}
					setMode={setMode}
					onPreview={(preview) => setPreviewScale(preview)}
				/>

				<SettingsSidebar
					strings={strings}
					setStrings={setStrings}
					frets={frets}
					setFrets={setFrets}
					mode={mode}
					setMode={setMode}
					root={root}
					setRoot={setRoot}
					settingsSidebarOpen={settingsSidebarOpen}
					setSettingsSidebarOpen={setSettingsSidebarOpen}
				/>

				<button
					type="button"
					// onClick={() => setShowChordsPopup((prev) => !prev)}
					aria-label="Toggle chord display"
					className="text-2xl cursor-pointer transition-transform duration-700 transform hover:text-gray-800 z-10"
				>
					<AudioLines size={36} />
				</button>
			</div>

			<div className="w-screen h-screen overflow-hidden flex items-center justify-center">
				{mode === "detection" && detectedScales.length > 0 && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
					>
						<span className="text-xs font-bold uppercase tracking-widest text-white/50">
							Suggested Scales
						</span>
						<div className="flex gap-2 overflow-x-auto pb-3 px-4 max-w-[90vw] no-scrollbar">
							{detectedScales.map((scale) => (
								<button
									key={scale}
									onClick={() => handleSelectDetectedScale(scale)}
									onMouseEnter={() => setPreviewScale(parseScale(scale))}
									onMouseLeave={() => setPreviewScale(null)}
									className="whitespace-nowrap px-4 py-1 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl text-white text-sm transition-all active:scale-95"
								>
									{scale}
								</button>
							))}
						</div>
					</motion.div>
				)}

				<div className="rotate-90 md:rotate-0 origin-center">
					<GuitarApp
						mode={
							previewScale
								? (previewScale.mode as keyof typeof modes)
								: (mode as keyof typeof modes)
						}
						root={previewScale ? previewScale.root : root}
						setMode={setMode}
						setRoot={setRoot}
						strings={strings}
						setStrings={setStrings}
						frets={frets}
						setFrets={setFrets}
						tuning={tuning}
						setTuning={setTuning}
						customIntervals={customIntervals}
						toggleCustomInterval={toggleCustomInterval}
						toggleDetectionInterval={toggleDetectionInterval}
						detectionIntervals={detectionIntervals}
						activeStrings={activeStrings}
						setActiveStrings={() => {}}
						handleActiveStringsChange={handleSliderChange}
						sliderRanges={sliderRanges}
						mutedFrets={mutedFrets}
						handleFretSliderChange={handleFretSliderChange}
					/>
				</div>
			</div>
		</motion.div>
	);
}
