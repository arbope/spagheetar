"use client";
import React from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

interface MuterProps {
	sliderIndex: number;
	strings: number;
	range: [number, number];
	onChange: (index: number, newRange: [number, number]) => void;
}

const StringMuter: React.FC<MuterProps> = ({
	sliderIndex,
	strings,
	range,
	onChange,
}) => {
	return (
		<div className="min-h-max w-1 ml-2.5 mt-15 mb-4 flex items-center justify-center">
			<RangeSlider
				className="thin-slider"
				min={0}
				max={strings}
				step={1}
				value={range}
				orientation="vertical"
				onInput={(val: [number, number]) => onChange(sliderIndex, val)}
			/>
		</div>
	);
};

export default StringMuter;
