interface SliderFormProps {
  value: number;
  setValue: (count: number) => void;
  active?: boolean;
  max?: number;
}

export const SliderForm = ({ value, setValue, active = true, max = 10 }: SliderFormProps) => {
  const handleCoinCountChange = (value: number) => {
    setValue(value);
  };

  return active ? (
    <div className="flex items-center bg-[#1A1832] px-3 py-2 rounded-tl-lg rounded-br-lg shadow-lg w-[200px]">
      <div className="w-16 text-white text-xs">X {value}</div>
      <input
        type="range"
        min="1"
        max={max}
        value={value}
        onChange={(e) => handleCoinCountChange(parseInt(e.target.value))}
        className="w-24 h-8 appearance-none bg-transparent cursor-pointer
                  bg-[url('/images/middle/slidebar/slidebar_active.png')] bg-contain
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:bg-[url('/images/middle/slidebar/btn_controller_active.png')] 
                  [&::-webkit-slider-thumb]:bg-contain
                  [&::-webkit-slider-thumb]:bg-no-repeat
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-6
                  [&::-moz-range-thumb]:w-6
                  [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:bg-[url('/images/middle/slidebar/btn_controller_active.png')] 
                  [&::-moz-range-thumb]:bg-contain
                  [&::-moz-range-thumb]:bg-no-repeat
                  [&::-moz-range-thumb]:cursor-pointer
                  "
      />
    </div>
  ) : (
    <div className="flex items-center bg-[#1A1832] px-3 py-2 rounded-tl-lg rounded-br-lg shadow-lg w-[200px]">
      <div className="w-16 text-gray-500 text-xs">X {value}</div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        disabled
        onChange={(e) => handleCoinCountChange(parseInt(e.target.value))}
        className="w-24 h-8 appearance-none bg-transparent cursor-pointer
                  bg-[url('/images/middle/slidebar/slidebar_non-active.png')] bg-contain
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:bg-[url('/images/middle/slidebar/btn_controller_non-active.png')] 
                  [&::-webkit-slider-thumb]:bg-contain
                  [&::-webkit-slider-thumb]:bg-no-repeat
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-6
                  [&::-moz-range-thumb]:w-6
                  [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:bg-[url('/images/middle/slidebar/btn_controller_non-active.png')] 
                  [&::-moz-range-thumb]:bg-contain
                  [&::-moz-range-thumb]:bg-no-repeat
                  [&::-moz-range-thumb]:cursor-pointer
                  "
      />
    </div>
  );
};
