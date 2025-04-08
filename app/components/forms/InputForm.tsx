import { useEffect, useState } from 'react';
import EthereumIcon from '../image/EthereumIcon';

interface SliderFormProps {
  value: number;
  setValue: (count: number | string | undefined) => void;
  disabled?: boolean;
}

export const InputForm = ({ value, setValue, disabled }: SliderFormProps) => {
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

    setValue(value);
    setInputValue(value.toString());
  };

  useEffect(() => {
    handleCoinCountChange(value.toString());
  }, [value]);

  return (
    <div
      className="flex items-center justify-between bg-[#24223D] 
        w-[240px] pr-3 px-4 gap-3
        rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg"
    >
      <EthereumIcon />

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        className="w-[100px] h-[60px] appearance-none bg-transparent cursor-pointer
                    bg-contain text-white focus:outline-none"
        disabled={disabled}
      />
      <div className="flex flex-row gap-1">
        <button
          onClick={() => !disabled && setValue(value / 2)}
          className="w-[36px] h-[28px] text-white 
                    bg-[url('/images/replaces/btn_1:2.png')] 
                    bg-cover bg-center bg-no-repeat
                    hover:opacity-90 active:opacity-70 transition-opacity"
        ></button>
        <button
          onClick={() => !disabled && setValue(value * 2)}
          className="w-[36px] h-[28px] text-white 
                    bg-[url('/images/replaces/btn_x2.png')] 
                    bg-cover bg-center bg-no-repeat
                    hover:opacity-90 active:opacity-70 transition-opacity"
        ></button>
      </div>
    </div>
  );
};
