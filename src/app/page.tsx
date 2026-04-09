"use client";

import { RefreshCcw, Github } from "lucide-react";
import Tuner from "./components/tuner";
import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { motion } from "framer-motion";
import GuitarApp from "./components/guitarApp";
import { Scale, Interval, Note } from "tonal";
import StyleSidebar from "./components/styleSidebar";
import SnowFlake from "./components/snowFlake";
import SettingsSidebar from "./components/settingsSidebar";
import { COLORS, modes, notes, getKeyShift, DEF_COLORS } from "./constants";

export default function Home() {
	// -- 1. UI & SIDEBAR STATE ---
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
	// --- 2. CORE GUITAR CONFIGURATION (with LocalStorage) ---
	const [strings, setStrings] = useState<number>(() => {
		if (typeof window === "undefined") return 6;
		const saved = localStorage.getItem("strings");
		return saved ? JSON.parse(saved) : 6;
	});

	const [frets, setFrets] = useState<number>(() => {
		if (typeof window === "undefined") return 12;
		const saved = localStorage.getItem("frets");
		return saved ? JSON.parse(saved) : 12;
	});

	const [mode, setMode] = useState<keyof typeof modes>(() => {
		if (typeof window === "undefined") return "major";
		const saved = localStorage.getItem("mode");
		return saved ? JSON.parse(saved) : "major";
	});

	const [root, setRoot] = useState<string>(() => {
		if (typeof window === "undefined") return "c";
		const saved = localStorage.getItem("root");
		return saved ? JSON.parse(saved) : "c";
	});

	const [tuning, setTuning] = useState<string[]>(() => {
		if (typeof window === "undefined") return ["e", "b", "g", "d", "a", "e"];
		const saved = localStorage.getItem("tuning");
		return saved ? JSON.parse(saved) : ["e", "b", "g", "d", "a", "e"];
	});

	// --- 3. INTERVALS & COLORS ---
	const [customIntervals, setCustomIntervals] = useState<number[]>([]);
	const [detectionIntervals, setDetectionIntervals] = useState<number[]>([]);
	const [customColors, setCustomColors] = useState([...COLORS]);

	// --- 4. SELECTION & MUTING STATE ---
	const numStringSliders = 2;
	const numFretSliders = 2;

	const [sliderRanges, setSliderRanges] = useState<[number, number][]>(
		Array.from({ length: numStringSliders }, () => [0, strings]),
	);

	const [mutedFrets, setMutedFrets] = useState<[number, number][]>(
		Array.from({ length: numFretSliders }, () => [0, frets]),
	);

	// --- 5. DERIVED STATE (REPLACES PREVIOUS SYNC EFFECTS) ---
	// This logic ensures that activeStrings/activeFrets are ALWAYS the right size
	const activeStrings = useMemo(() => {
		const nextActive = Array(strings).fill(false);
		sliderRanges.forEach(([min, max]) => {
			for (let i = Math.floor(min); i < Math.ceil(max); i++) {
				if (i >= 0 && i < strings) nextActive[i] = true;
			}
		});
		return nextActive;
	}, [sliderRanges, strings]);

	const activeFrets = useMemo(() => {
		const nextActive = Array(frets).fill(false);
		mutedFrets.forEach(([min, max]) => {
			for (let i = Math.floor(min); i < Math.ceil(max); i++) {
				if (i >= 0 && i < frets) nextActive[i] = true;
			}
		});
		return nextActive;
	}, [mutedFrets, frets]);

	// --- 6. SYNC EFFECTS (LocalStorage & Boundaries) ---

	useEffect(() => localStorage.setItem("mode", JSON.stringify(mode)), [mode]);
	useEffect(() => localStorage.setItem("root", JSON.stringify(root)), [root]);
	useEffect(
		() => localStorage.setItem("tuning", JSON.stringify(tuning)),
		[tuning],
	);

	// Adjust slider ranges when string/fret counts change
	useEffect(() => {
		localStorage.setItem("strings", JSON.stringify(strings));
		setSliderRanges((prev) =>
			prev.map(([min, max]) => [
				Math.min(min, strings),
				max >= strings - 1 || max === 0 ? strings : Math.min(max, strings),
			]),
		);
	}, [strings]);

	useEffect(() => {
		localStorage.setItem("frets", JSON.stringify(frets));
		setMutedFrets((prev) =>
			prev.map(([min, max]) => [
				Math.min(min, frets),
				max >= frets - 1 || max === 0 ? frets : Math.min(max, frets),
			]),
		);
	}, [frets]);

	// Sync Tuning array size with String count
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

	// Background Color Management
	const body = typeof window !== "undefined" ? document.documentElement : null;
	const getCssVar = (name: string, fallback: string) =>
		body
			? getComputedStyle(body).getPropertyValue(name).trim() || fallback
			: fallback;

	const [bgColors, setBgColors] = useState({
		first: getCssVar("--first-color", "#034f1b"),
		second: getCssVar("--second-color", "#bd3634"),
		third: getCssVar("--third-color", "#ceac5c"),
	});

	useEffect(() => {
		if (body && animatedBg) {
			body.style.setProperty("--duration", duration.toString());
		}
	}, [duration, animatedBg, body]);

	// --- 7. HANDLERS & LOGIC ---

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
				// 1. Get the actual note names (e.g., "C", "G", "A")
				const notesInSet = next.map((i) =>
					Note.transpose(root, Interval.fromSemitones(i)),
				);

				// 2. Get unique pitch classes (removes octaves/duplicates)
				const distinctNotes = [
					...new Set(notesInSet.map((n) => Note.get(n).pc)),
				];

				console.log("--- Detection Debug ---");
				console.log("Selected Notes:", distinctNotes);

				let allMatches: string[] = [];

				// 3. Force the library to check EVERY clicked note as a potential root
				distinctNotes.forEach((tonic) => {
					const matches = Scale.detect(notesInSet, { tonic: tonic });
					console.log(`Checking root [${tonic}]:`, matches);
					allMatches = [...allMatches, ...matches];
				});

				// 4. Fallback: If no exact scales found, find scales that START with these notes
				if (allMatches.length === 0) {
					console.log(
						"No exact matches. Finding scales that contain these notes...",
					);
					// This is where you'd see more "suggested" results
				}

				const finalResults = [...new Set(allMatches)];
				console.log("Final List:", finalResults);

				setDetectedScales(finalResults);
			} else {
				setDetectedScales([]);
			}
			return next;
		});
	};

	const handleSelectDetectedScale = (scaleName: string) => {
		const parts = scaleName.split(" ");
		const newRoot = parts[0];
		const newMode = parts.slice(1).join(" ");
		setRoot(newRoot.toLowerCase());
		setMode(newMode as keyof typeof modes);

		setDetectionIntervals([]);
		setDetectedScales([]);
	};

	const detectScale = (intervals: number[], root: string) => {
		if (intervals.length === 0) return [];
		const notesInScale = intervals.map((interval) =>
			Note.transpose(root, Interval.fromSemitones(interval)),
		);

		return Scale.detect(notesInScale);
	};

	function updateColor(index: number, newColor: string) {
		COLORS[index] = newColor;
		setCustomColors([...COLORS]);
	}

	function resetColors() {
		for (let i = 0; i < COLORS.length - 1; i++) {
			COLORS[i] = DEF_COLORS[i];
		}
		setCustomColors([...COLORS]);
	}

	function updateBgColor(name: "first" | "second" | "third", color: string) {
		if (!body) return;
		body.style.setProperty(`--${name}-color`, color);
		setBgColors((prev) => ({ ...prev, [name]: color }));
	}

	function resetSettings() {
		localStorage.removeItem("strings");
		setStrings(6);
		localStorage.removeItem("frets");
		setFrets(12);
		localStorage.removeItem("mode");
		setMode("major");
		localStorage.removeItem("root");
		setRoot("c");
		localStorage.removeItem("tuning");
		setTuning(["e", "b", "g", "d", "a", "e"]);
		setCustomIntervals([]);
		setDetectionIntervals([]);
		resetColors();
		setAnimatedBg(false);
		setSliderRanges(Array.from({ length: numStringSliders }, () => [0, 6]));
		setMutedFrets(Array.from({ length: numFretSliders }, () => [0, 12]));
	}

	const animationClass = animatedBg ? "animated-gradient-bg" : "";

	// --- 8. RENDER ---
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

			<p className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl transform transition-all duration-1500 hover:translate-y-3 hover:text-black text-center">
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
			</div>

			<div className="w-screen h-screen verflow-hidden flex items-center justify-center">
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
							previewScale ? (previewScale.mode as keyof typeof modes) : mode
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
						activeStrings={activeStrings} // Now derived instantly via useMemo
						setActiveStrings={() => {}} // Placeholder: derived state doesn't need a setter
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
