import Image from 'next/image';
import { forwardRef, useCallback, useImperativeHandle } from 'react';

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
  repeatTrying: number;
  disabled: boolean;
  ref?: React.ForwardedRef<{ triggerFlip: () => boolean }>;
}

export const ActionButtons = forwardRef(
  (
    {
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
      repeatTrying,
      disabled,
    }: ActionButtonsProps,
    ref
  ) => {
    const triggerFlip = useCallback(() => {
      if (!selectedSide || isFlipping || !betAmount || !onFlip) {
        return false;
      }
      onFlip();
      return true;
    }, [selectedSide, isFlipping, betAmount, onFlip]);

    useImperativeHandle(ref, () => ({
      triggerFlip,
    }));

    return (
      <div
        className="h-[260px] mx-[-10px] bg-[url('/images/middle/img_main-board.png')] bg-cover bg-center bg-no-repeat 
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
        <div className="flex flex-row items-center px-10">
          <div className="flex items-center justify-between w-8/12 flex-wrap pl-8">
            <div className="relative flex items-center w-1/3 mt-10">
              <div className="flex flex-col items-center">
                <CheckBox
                  checked={autoFlip}
                  onChange={(checked) => () => {
                    // setAutoFlip(checked);
                  }}
                  className="absolute -top-8 left-0 w-[10px] h-[10px]"
                />
                <label className="block text-left mb-2 absolute -top-4 left-4 right-0 text-gray-500 text-[8px] ">
                  AUTOBET{' '}
                  <b className={repeatTrying > 0 ? 'animate-pulse text-yellow-300' : 'text-[7px]'}>
                    {repeatTrying > 0 ? '(tap spacebar)' : '(Comming Soon)'}
                  </b>
                </label>
              </div>
              <SliderForm value={autoFlipCount} setValue={setAutoFlipCount} active={autoFlip} />
            </div>
            <div className="relative flex items-center w-1/3 mt-10">
              <label className="block text-left mb-2 absolute -top-4 left-0 right-0 text-gray-300 text-[8px] ">
                COINS AMOUNT
              </label>
              <SliderForm value={coinCount} setValue={setCoinCount} />
            </div>

            <div className="relative flex items-center w-1/3 mt-10">
              <label className="block text-left mb-2 absolute -top-4 left-0 right-0 text-gray-300 text-[8px] ">
                WAGER
              </label>
              <button
                onClick={() => setBetAmount(balance)}
                className="absolute -top-4 right-4 w-[40px] h-[12px]
                bg-[url('/images/middle/buttons/btn_max.png')] bg-contain bg-no-repeat bg-center
                hover:opacity-90 active:opacity-70 transition-opacity
                active:bg-[url('/images/middle/buttons/btn_max_pressed.png')]"
                aria-label="Max Bet"
              ></button>
              <InputForm value={betAmount} setValue={setBetAmount} max={balance} />
            </div>

            <div className="relative flex items-center w-1/3 mt-10">
              <label className="block text-left mb-2 absolute -top-4 left-0 right-0 text-gray-300 text-[8px]  ">
                PRESETS
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

            <div className="relative flex items-center w-1/3 mt-10">
              <label className="block text-left mb-2 absolute -top-4 left-0 right-0 text-gray-300 text-[8px] ">
                MIN HEADS / TAILS
              </label>
              <SliderForm value={minHeads} setValue={setMinHeads} max={coinCount} />
            </div>
            <div className="relative flex items-center w-1/3 mt-10">
              <label className="block text-left mb-2 absolute -top-4 left-0 right-0 text-gray-300 text-[8px] ">
                POTENTIAL WIN
              </label>
              <TextForm value={expectedValue} />
            </div>
          </div>

          <div className="flex justify-center items-center w-4/12 flex-wrap relative">
            <div className="flex flex-col items-center pt-[40px]">
              <label className="block text-left absolute top-[25px] left-[42px] text-gray-300 text-[8px]">
                PICK SIDE
              </label>
              <div className="flex flex-row items-center gap-1 w-full">
                <div className="flex flex-col items-center">
                  <div className="w-[5px] h-[5px] relative">
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
                  <div className="w-[64px] h-[64px]">
                    <img
                      src={
                        selectedSide === 'HEADS'
                          ? '/images/middle/coins/img_koala-coin_front_124px.png'
                          : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                      }
                      alt="HEADS"
                      className={`w-[64px] h-[64px] cursor-pointer
                    ${selectedSide === 'HEADS' ? 'transform scale-[1.3]' : ''}`}
                      onClick={() => !isFlipping && setSelectedSide('HEADS')}
                      style={{ opacity: isFlipping ? 0.5 : 1 }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  {selectedSide === 'TAILS' ? (
                    <img
                      className="w-[5px] h-[5px]"
                      src="/images/middle/coins/ic_back_selected.png"
                      alt="TAILS"
                    />
                  ) : (
                    <div className="w-[5px] h-[5px]">&nbsp;</div>
                  )}
                  <div className="w-[64px] h-[64px]">
                    <img
                      src={
                        selectedSide === 'TAILS'
                          ? '/images/middle/coins/img_koala-coin_back_124px.png'
                          : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                      }
                      alt="TAILS"
                      className={`w-[64px] h-[64px] cursor-pointer 
                    ${selectedSide === 'TAILS' ? 'transform scale-[1.3]' : ''}`}
                      onClick={() => !isFlipping && setSelectedSide('TAILS')}
                      style={{ opacity: isFlipping ? 0.5 : 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center mt-[10px]">
              <button
                className={`w-[140px] h-[28px] cursor-pointer 
                flex items-center justify-center
                select-none 
                touch-none
                bg-no-repeat bg-cover bg-center
                bg-[url('/images/middle/buttons/btn_flip-cta_no-txt.png')]
                active:bg-[url('/images/middle/buttons/btn_flip-cta_pressed_no-txt.png')]
                disabled:opacity-50
              `}
                onClick={!selectedSide || isFlipping || !betAmount ? undefined : onFlip}
                disabled={disabled || !selectedSide || isFlipping || !betAmount}
              >
                {disabled ? (
                  <span className=" text-white text-[9px]">NOT AVAILABLE BETTING</span>
                ) : (
                  <span className=" text-white text-[9px]">
                    FLIP COINS -{' '}
                    <Image
                      src="/images/ethereum-svgrepo-com.svg"
                      alt="ETH"
                      className="w-[10px] my-auto inline"
                      width={12}
                      height={12}
                    />{' '}
                    {betAmount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
