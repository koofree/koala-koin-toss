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
    <div
      className="flex flex-row items-center justify-center bg-[#24223D] px-3 py-[6px] 
      rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg
      shadow-2xl w-[216px] h-[60px]"
    >
      <div className="w-[41px] text-white">X {value}</div>
      <input
        type="range"
        min="1"
        max={max}
        value={value}
        onChange={(e) => handleCoinCountChange(parseInt(e.target.value))}
        className="w-[124px] h-[38px] appearance-none bg-transparent cursor-pointer
                  bg-[url('/images/middle/slidebar/slidebar_active.png')] bg-contain bg-no-repeat
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-[38px]
                  [&::-webkit-slider-thumb]:w-[26px]
                  [&::-webkit-slider-thumb]:bg-[url('/images/middle/slidebar/btn_controller_active.png')] 
                  [&::-webkit-slider-thumb]:bg-contain
                  [&::-webkit-slider-thumb]:bg-no-repeat
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-[38px]
                  [&::-moz-range-thumb]:w-[26px]
                  [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:bg-[url('/images/middle/slidebar/btn_controller_active.png')] 
                  [&::-moz-range-thumb]:bg-contain
                  [&::-moz-range-thumb]:bg-no-repeat
                  [&::-moz-range-thumb]:cursor-pointer
                  "
      />
    </div>
  ) : (
    <div
      className="flex flex-row items-center justify-center bg-[#24223D] px-3 py-[6px] 
      rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg
      shadow-2xl w-[216px] h-[60px]"
    >
      <div className="w-[41px] text-gray-500">X {value}</div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        disabled
        onChange={(e) => handleCoinCountChange(parseInt(e.target.value))}
        className="w-[124px] h-[38px] appearance-none bg-transparent cursor-pointer
                  bg-[url('/images/middle/slidebar/slidebar_non-active.png')] bg-contain bg-no-repeat
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-[38px]
                  [&::-webkit-slider-thumb]:w-[26px]
                  [&::-webkit-slider-thumb]:bg-[url('/images/middle/slidebar/btn_controller_non-active.png')] 
                  [&::-webkit-slider-thumb]:bg-contain
                  [&::-webkit-slider-thumb]:bg-no-repeat
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-[38px]
                  [&::-moz-range-thumb]:w-[26px]
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
