"use client";

import React, { useState, useEffect } from "react";
import Fretboard from "./fretboard";
import StringTuner from "./stringTuner";
import { modes } from "../constants";
import StringMuter from "./stringMuter";
const GuitarApp = ({
	mode,
	setMode,
	root,
	setRoot,
	strings,
	setStrings,
	frets,
	setFrets,
	tuning,
	setTuning,
	customIntervals,
	toggleCustomInterval,
	detectionIntervals,
	toggleDetectionInterval,
	activeStrings,
	sliderRanges,
	handleActiveStringsChange: handleSliderChange,
	setActiveStrings,
	mutedFrets,
	handleFretSliderChange,
}: {
	mode: keyof typeof modes;
	setMode: React.Dispatch<React.SetStateAction<keyof typeof modes>>;
	root: string;
	setRoot: React.Dispatch<React.SetStateAction<string>>;
	strings: number;
	setStrings: React.Dispatch<React.SetStateAction<number>>;
	frets: number;
	setFrets: React.Dispatch<React.SetStateAction<number>>;
	tuning: string[];
	setTuning: React.Dispatch<React.SetStateAction<string[]>>;
	customIntervals: number[];
	toggleCustomInterval: (interval: number) => void;
	toggleDetectionInterval: (interval: number) => void;
	detectionIntervals: number[];
	activeStrings: boolean[];
	sliderRanges: [number, number][];
	handleActiveStringsChange: (
		index: number,
		newRange: [number, number],
	) => void;
	setActiveStrings: React.Dispatch<React.SetStateAction<boolean[]>>;
	mutedFrets: [number, number][];
	handleFretSliderChange: (index: number, newRange: [number, number]) => void;
}) => {
	return (
		<div>
			<div className="flex justify-center max-h-[85vh]">
				<StringTuner
					root={root}
					mode={mode}
					strings={strings}
					tuning={tuning}
					setTuning={setTuning}
					customIntervals={customIntervals}
				/>

				<Fretboard
					strings={strings}
					frets={frets}
					tuning={tuning}
					mode={mode}
					root={root}
					setRoot={setRoot}
					onToggleCustomInterval={toggleCustomInterval}
					customIntervals={customIntervals}
					onToggleDetectionInterval={toggleDetectionInterval}
					detectionIntervals={detectionIntervals}
					activeStrings={activeStrings}
					handleFretSliderChange={handleFretSliderChange}
					mutedFrets={mutedFrets}
				/>

				{sliderRanges.map((range, idx) => (
					<StringMuter
						key={idx}
						sliderIndex={idx}
						strings={strings}
						range={range}
						onChange={handleSliderChange}
					/>
				))}
			</div>
		</div>
	);
};

export default GuitarApp;
