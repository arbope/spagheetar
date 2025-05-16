"use client";

interface StringProps {
    strings: number;
    tuning: string[];
    setTuning: (value: string[]) => void;
}

const StringTuner: React.FC<StringProps> = ({ strings , tuning, setTuning}) => {
    const refineTuning = (index: number, value: string) => {
        const tuner = [...tuning];
        tuner[index] = value;
        setTuning(tuner);
    };
    return (
        <div className='h-min w-7'>
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
        </div>
    );
}
export default StringTuner;