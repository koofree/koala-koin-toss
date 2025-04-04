import { useState } from 'react';

interface SelectFormProps {
  minHeads: number;
  coinCount: number;
  setMinHeadsAndCoinCount: (minHeads: number, coinCount: number) => void;
}

export const SelectForm = ({ minHeads, coinCount, setMinHeadsAndCoinCount }: SelectFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { idx: 0, minHeads: 5, coinCount: 10, label: '10:5 (x1.31)' },
    { idx: 1, minHeads: 1, coinCount: 1, label: '1:1 (x1.64)' },
    { idx: 2, minHeads: 3, coinCount: 4, label: '4:3 (x2.62)' },
    { idx: 3, minHeads: 5, coinCount: 6, label: '6:5 (x7.49)' },
    { idx: 4, minHeads: 8, coinCount: 9, label: '9:8 (x41.99)' },
    { idx: 5, minHeads: 10, coinCount: 10, label: '10:10 (x839.93)' },
    { idx: 6, minHeads: 0, coinCount: 0, label: 'CUSTOM' },
  ];

  const selectedOption =
    options.find((option) => option.minHeads === minHeads && option.coinCount === coinCount) ??
    options[6];

  const handleOptionSelect = (option: (typeof options)[0]) => {
    setMinHeadsAndCoinCount(option.minHeads, option.coinCount);
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-[216px] h-[60px] bg-[#24223D] 
      rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg shadow-2xl
    "
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-[60px]
        bg-[url('/images/middle/dropdown/btn_dropdown.png')] 
        bg-cover bg-center bg-no-repeat 
        px-3 py-1 rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg shadow-2xl
        text-white hover:opacity-90 transition-opacity"
      >
        <span>{selectedOption.label}</span>
        <div
          className={`w-0 h-0 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}
          absolute top-1/2 right-3 -translate-x-1/2 -translate-y-1/2
          `}
          style={{
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '6px solid white',
            marginTop: '2px',
          }}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 shadow-xl">
          <div
            className="py-2
            bg-[url('/images/middle/dropdown/dropdown_list_middle.png')] 
            bg-cover bg-center rounded-lg"
          >
            {options.map((option) => (
              <button
                key={option.idx}
                onClick={() => handleOptionSelect(option)}
                className="
                    w-[200px] mx-2 pl-2 py-2 text-left text-white
                     hover:bg-white hover:bg-opacity-10 rounded-md"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
