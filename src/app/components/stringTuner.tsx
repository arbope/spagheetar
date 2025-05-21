"use client";
import { ArrowUpFromLine } from "lucide-react";
import { ArrowDownFromLine } from "lucide-react";

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

    return (
        <div className='h-min w-7'>
            <div onClick={tuneUp}>
                <ArrowUpFromLine />
            </div>
            {Array.from({ length: strings }).map((_, index) => (
                <div className="flex border-y-1 border-l-1 border-indigo-500 " key={index}>
                    <div className="bg-gray-600 h-7 border-x-1 border-indigo-500 flex items-center justify-center flex-1">
                        <select
                            className="appearance-none bg-transparent text-center text-xs w-full h-full p-1 focus:outline-none cursor-pointer text-black"
                            value={tuning[index]}
                            onChange={(e) => refineTuning(index, String(e.target.value))}
                        >
                            {['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'].map((note) => (
                                <option key={note} value={note}>
                                    {note.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <div onClick={tuneUp}>
                <ArrowDownFromLine />
            </div>
        </div>
    );
}
export default StringTuner;