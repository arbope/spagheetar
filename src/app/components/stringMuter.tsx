'use client';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface MuterProps {
  strings: number;
  mutedStrings: [number,number];
  setMutedStrings: (range: [number,number]) => void;
}

const StringMuter: React.FC<MuterProps> = ({ strings, mutedStrings, setMutedStrings }) => {

  const handleInput = (newRange: [number, number]) => {
    setMutedStrings(newRange);
  };

  return (
    <div className="min-h-max w-1 ml-2.5 mt-12 mb-6 flex items-center justify-center">
      <RangeSlider
        id="range-slider2"
        min={0}
        max={strings}
        value={mutedStrings}
        orientation="vertical"
        className="range-slider-vertical"
        onInput={handleInput} />
    </div>
  );
};

export default StringMuter;
