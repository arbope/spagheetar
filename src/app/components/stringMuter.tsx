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
    <div className="h-[180px] w-7 mt-[50px] flex items-center justify-center">
      <RangeSlider
        id="range-slider2"
        min={0}
        max={strings}
        step={1}
        value={mutedStrings}
        orientation="vertical"
        className="range-slider-vertical"
        onInput={handleInput} />
    </div>
  );
};

export default StringMuter;
