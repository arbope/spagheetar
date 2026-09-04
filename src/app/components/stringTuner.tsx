"use client";
import { ArrowDownFromLine } from "lucide-react";
import { getKeyShift, getNoteColor, modes, notes, notes2 } from "../constants";

interface StringProps {
	strings: number;
	tuning: string[];
	mode: keyof typeof modes;
	root: string;
	setTuning: (value: string[]) => void;
	customIntervals?: number[];
}

const StringTuner: React.FC<StringProps> = ({
	strings,
	tuning,
	setTuning,
	mode,
	root,
	customIntervals = [],
}) => {
	const intervals =
		mode === "custom" ? customIntervals : modes[mode] || modes["major"];

	const refineTuning = (index: number, value: string) => {
		const tuner = [...tuning];
		tuner[index] = value;
		setTuning(tuner);
	};

	const tuneUp = () => {
		const updatedTuning = tuning.map((note) => {
			const currentIndex = notes.indexOf(note.toLowerCase());
			const nextIndex = (currentIndex + 1) % notes.length;
			return notes[nextIndex];
		});
		setTuning(updatedTuning);
	};

	const tuneDown = () => {
		const updatedTuning = tuning.map((note) => {
			const currentIndex = notes.indexOf(note.toLowerCase());
			const prevIndex = (currentIndex - 1 + notes.length) % notes.length;
			return notes[prevIndex];
		});
		setTuning(updatedTuning);
	};

	return (
		<div className="h-min w-8 mt-9">
			<div
				onClick={tuneUp}
				className="mr-2 mb-2 rotate-180 cursor-pointer transition-transform transform text-xl hover:text-gray-400"
			>
				<ArrowDownFromLine strokeWidth={3} />
			</div>

			{Array.from({ length: strings }).map((_, index) => {
				const note = tuning[index];
				const noteIndex = (getKeyShift(note) - getKeyShift(root) + 12) % 12;
				const isInScale = intervals.includes(noteIndex);
				const color = isInScale ? getNoteColor(note, root) : "#EEEEEE";

				return (
					<div
						className="flex border-y border-l border-transparent hover:transition-all duration-200"
						key={index}
					>
						<div className="bg-gray-700 h-9 border-x border-transparent hover:bg-gray-600 transition-colors flex items-center justify-center flex-1 rounded-xs">
							<select
								className="appearance-none bg-transparent text-center w-full h-full p-1 focus:outline-none cursor-pointer transition-all"
								style={{ color }}
								value={note}
								onChange={(e) => refineTuning(index, String(e.target.value))}
							>
								{notes2
									.slice()
									.reverse()
									.map((noteOption) => (
										<option
											key={noteOption}
											value={noteOption}
											className="text-black"
										>
											{noteOption.toUpperCase()}
										</option>
									))}
							</select>
						</div>
					</div>
				);
			})}
			<div
				onClick={tuneDown}
				className="pt-2 pl-2 rotate-360 cursor-pointer transition-transform transform hover:text-gray-600"
			>
				<ArrowDownFromLine strokeWidth={3} />
			</div>
		</div>
	);
};

export default StringTuner;
