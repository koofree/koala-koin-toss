import { CheckBox } from './forms/CheckBox';
import { InputForm } from './forms/InputForm';
import { SelectForm } from './forms/SelectForm';
import { SliderForm } from './forms/SliderForm';
import { TextForm } from './forms/TextForm';
import { TitlePanel } from './forms/TitlePanel';

interface ActionButtonsProps {
  selectedSide: 'HEADS' | 'TAILS' | null;
  setSelectedSide: (side: 'HEADS' | 'TAILS' | null) => void;
  isFlipping: boolean;
  autoFlip: boolean;
  setAutoFlip: (enabled: boolean) => void;
  onFlip?: () => void;
  coinCount: number;
  setCoinCount: (count: number) => void;
  minHeads: number;
  setMinHeads: (count: number) => void;
  autoFlipCount: number;
  setAutoFlipCount: (count: number) => void;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  balance: number;
  winningProbability: number;
  expectedValue: number;
}

export const ActionButtons = ({
  selectedSide,
  setSelectedSide,
  isFlipping,
  autoFlip,
  setAutoFlip,
  onFlip,
  coinCount,
  setCoinCount,
  minHeads,
  setMinHeads,
  autoFlipCount = 1,
  setAutoFlipCount,
  betAmount,
  setBetAmount,
  balance,
  winningProbability,
  expectedValue,
}: ActionButtonsProps) => {
  return (
    <div
      className="space-y-14 bg-[url('/images/middle/img_main-board.png')] bg-cover bg-center bg-no-repeat 
      rounded-lg
      flex flex-col items-center
    "
    >
      <TitlePanel
        selectedSide={selectedSide}
        coinCount={coinCount}
        minHeads={minHeads}
        winningProbability={winningProbability}
      />
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-between w-8/12 flex-wrap">
          <div className="relative flex items-center w-1/3">
            <div className="flex flex-col items-center">
              <CheckBox
                checked={autoFlip}
                onChange={(checked) => setAutoFlip(checked)}
                className="absolute -top-12 left-0"
              />
              <label className="block text-left mb-2 absolute -top-6 left-10 right-0 text-gray-300 text-xs ">
                AUTOBET
              </label>
            </div>
            <SliderForm value={autoFlipCount} setValue={setAutoFlipCount} active={autoFlip} />
          </div>
          <div className="relative flex items-center w-1/3">
            <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
              COINS AMOUNT
            </label>
            <SliderForm value={coinCount} setValue={setCoinCount} />
          </div>

          <div className="relative flex items-center w-1/3">
            <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
              WAGER
            </label>
            <InputForm value={betAmount} setValue={setBetAmount} max={balance} />
          </div>

          <div className="relative flex items-center w-1/3">
            <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
              MIN HEADS / TAILS
            </label>
            <SelectForm
              minHeads={minHeads}
              coinCount={coinCount}
              setMinHeadsAndCoinCount={(minHeads, coinCount) => {
                setCoinCount(coinCount);
                setMinHeads(minHeads);
              }}
            />
          </div>

          <div className="relative flex items-center w-1/3">
            <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
              MIN HEADS / TAILS
            </label>
            <SliderForm value={minHeads} setValue={setMinHeads} max={coinCount} />
          </div>
          <div className="relative flex items-center w-1/3">
            <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
              POTENTIAL WIN
            </label>
            <TextForm value={expectedValue} />
          </div>
        </div>

        <div className="flex justify-center items-center w-4/12 flex-wrap relative">
          <label className="block text-left mb-2 absolute -top-6 left-0 right-0 text-gray-300 text-xs ">
            PICK SIDE
          </label>
          <div className="flex flex-row items-center gap-4 w-full">
            <div className="flex flex-col items-center">
              <div className="w-[5px] h-[5px] relative mb-2">
                {selectedSide === 'HEADS' ? (
                  <img
                    className="w-full"
                    src="/images/middle/coins/ic_front_selected.png"
                    alt="HEADS"
                  />
                ) : (
                  <>&nbsp;</>
                )}
              </div>
              <div className="w-[80px] h-[80px]">
                <img
                  src={
                    selectedSide === 'HEADS'
                      ? '/images/middle/coins/img_koala-coin_front_124px-1.png'
                      : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                  }
                  alt="HEADS"
                  className="cursor-pointer"
                  width={80}
                  height={80}
                  onClick={() => !isFlipping && setSelectedSide('HEADS')}
                  style={{ opacity: isFlipping ? 0.5 : 1 }}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              {selectedSide === 'TAILS' ? (
                <img
                  className="w-[5px] h-[5px] mb-2"
                  src="/images/middle/coins/ic_back_selected.png"
                  alt="TAILS"
                />
              ) : (
                <div className="w-[5px] h-[5px] mb-2">&nbsp;</div>
              )}
              <img
                src={
                  selectedSide === 'TAILS'
                    ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                }
                alt="TAILS"
                className="w-[80px] h-[80px] cursor-pointer"
                onClick={() => !isFlipping && setSelectedSide('TAILS')}
                style={{ opacity: isFlipping ? 0.5 : 1 }}
              />
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <button
              className={`w-[160px] h-8 cursor-pointer 
                elect-none 
                touch-none
                bg-no-repeat bg-cover bg-center
                bg-[url('/images/middle/buttons/btn_flip-cta_no-txt.png')]
                active:bg-[url('/images/middle/buttons/btn_flip-cta_pressed_no-txt.png')]
              `}
              onClick={!selectedSide || isFlipping ? undefined : onFlip}
              disabled={!selectedSide || isFlipping}
            >
              <span className=" text-white text-[11px]">FLIP COINS - $ {betAmount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
