import { floorNumber } from '@/utils/floorNumber';
import { useEffect, useState } from 'react';
import { Image } from '../image/image';

interface SliderFormProps {
  value: number;
  setValue: (count: number) => void;
  max: number;
  disabled?: boolean;
}

export const InputForm = ({ value, setValue, max, disabled }: SliderFormProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleCoinCountChange = (_value: string) => {
    if (!_value) {
      setValue(0);
      setInputValue('');
      return;
    }

    if (_value.endsWith('.') || _value.endsWith('0')) {
      setInputValue(_value);
      return;
    }

    let value = floorNumber(parseFloat(_value));

    if (value > max) {
      value = max;
    }

    setValue(value);
    setInputValue(value.toString());
  };

  useEffect(() => {
    handleCoinCountChange(value.toString());
  }, [value]);

  return (
    <div
      className="flex items-center bg-[#24223D] 
        w-[240px] pr-3 pl-2 
        rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg shadow-2xl"
    >
      <div className="w-[16px] inline-block mx-2">
        <Image
          src="/images/ethereum-svgrepo-com.svg"
          alt="ETH"
          className="flex w-[16px] my-auto mr-3"
          width={16}
          height={16}
        />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleCoinCountChange(e.target.value)}
        className="w-[120px] h-[60px] appearance-none bg-transparent cursor-pointer
                    bg-contain text-white focus:outline-none"
        disabled={disabled}
      />
      <div className="flex flex-row gap-1 right-[20px]">
        <button
          onClick={() => !disabled && handleCoinCountChange((value / 2).toString())}
          className="w-[36px] h-[28px] text-white 
                    bg-[url('/images/replaces/btn_1:2.png')] 
                    bg-cover bg-center bg-no-repeat
                    hover:opacity-90 active:opacity-70 transition-opacity"
        ></button>
        <button
          onClick={() => !disabled && handleCoinCountChange((value * 2).toString())}
          className="w-[36px] h-[28px] text-white 
                    bg-[url('/images/replaces/btn_x2.png')] 
                    bg-cover bg-center bg-no-repeat
                    hover:opacity-90 active:opacity-70 transition-opacity"
        ></button>
      </div>
    </div>
  );
};
