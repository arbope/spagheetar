"use client";
import { ArrowUpFromLine, ArrowDownFromLine } from "lucide-react";

interface StringProps {
    strings: number;
    tuning: string[];
    setTuning: (value: string[]) => void;
}

const StringTuner: React.FC<StringProps> = ({ strings, tuning, setTuning }) => {
    const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

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
        <div className="h-min w-7">
            <div
                onClick={tuneDown}
                className="cursor-pointer text-indigo-500 hover:text-indigo-700 transition-colors duration-200 rotate-90"
            >
                <ArrowUpFromLine />
            </div>

            {Array.from({ length: strings }).map((_, index) => (
                <div
                    className="flex border-y border-l border-indigo-400 hover:border-indigo-600 transition-all duration-200"
                    key={index}
                >
                    <div className="bg-gray-700 h-7 border-x border-indigo-400 hover:bg-gray-600 transition-colors flex items-center justify-center flex-1">
                        <select
                            className="appearance-none bg-transparent text-center text-xs w-full h-full p-1 focus:outline-none cursor-pointer text-white hover:text-indigo-200 transition-all"
                            value={tuning[index]}
                            onChange={(e) => refineTuning(index, String(e.target.value))}
                        >
                            {notes.map((note) => (
                                <option key={note} value={note} className="text-red">
                                    {note.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <div
                onClick={tuneUp}
                className="cursor-pointer text-indigo-500 hover:text-indigo-700 transition-colors duration-200 rotate-90 pl-1"
            >
                <ArrowDownFromLine />
            </div>
        </div>
    );
};

export default StringTuner;
