import { useState } from "react";

export function useGuitarState() {
	const [strings, setStrings] = useState(6);
	const [frets, setFrets] = useState(12);
	const [mode, setMode] = useState<"major" | "minor" | "detection">("major");
	const [root, setRoot] = useState("c");
	const [tuning, setTuning] = useState(["e", "b", "g", "d", "a", "e"]);
	const [customIntervals, setCustomIntervals] = useState<number[]>([]);
	const [detectionIntervals, setDetectionIntervals] = useState<number[]>([]);
	const [mutedStrings, setMutedStrings] = useState<[number, number]>([0, 6]);
	const [mutedFrets, setMutedFrets] = useState<[number, number]>([0, 12]);

	const toggleCustomInterval = (interval: number) => {
		setCustomIntervals((prev) =>
			prev.includes(interval)
				? prev.filter((i) => i !== interval)
				: [...prev, interval],
		);
	};

	const toggleDetectionInterval = (interval: number) => {
		setDetectionIntervals((prev) =>
			prev.includes(interval)
				? prev.filter((i) => i !== interval)
				: [...prev, interval],
		);
	};

	return {
		strings,
		setStrings,
		frets,
		setFrets,
		mode,
		setMode,
		root,
		setRoot,
		tuning,
		setTuning,
		customIntervals,
		toggleCustomInterval,
		detectionIntervals,
		toggleDetectionInterval,
		mutedStrings,
		setMutedStrings,
		mutedFrets,
		setMutedFrets,
	};
}
