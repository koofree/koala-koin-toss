import { INITIAL_BET_AMOUNT } from '@/config';
import { useBalance } from '@/hooks/useBalance';
import { useUserGameOptionStore } from '@/store/useUserGameOptionStore';
import { floorNumber } from '@/utils/floorNumber';
import { useEffect } from 'react';
import { PanelButton } from '../buttons/PanelButton';
import { CheckBox } from '../forms/CheckBox';
import { InputForm } from '../forms/InputForm';
import { SelectForm } from '../forms/SelectForm';
import { SliderForm } from '../forms/SliderForm';
import { TextForm } from '../forms/TextForm';
import { Image } from '../image/image';

interface SettingsProps {
  autoFlip: boolean;
  setAutoFlip: (autoFlip: boolean) => void;
  autoFlipCount: number;
  setAutoFlipCount: (autoFlipCount: number) => void;
  isFlipping: boolean;
  onFlip?: () => void;
  balance: number;
  expectedValue: number;
  disabled: boolean;
  repeatTrying: number;
}

const Settings = ({
  autoFlip,
  autoFlipCount,
  setAutoFlipCount,
  isFlipping,
  onFlip,
  balance,
  expectedValue,
  disabled,
  repeatTrying,
}: SettingsProps) => {
  const { ethBalance } = useBalance();
  const { userGameOption, setCoinCount, setMinHeads, setSelectedSide, setBetAmount } =
    useUserGameOptionStore();

  const setConvertedBetAmount = (betAmount: number | string | undefined) => {
    if (ethBalance.formatted <= 0) {
      return;
    }

    const betLimits = userGameOption.option?.[6];
    if (!betAmount || !betLimits || !Array.isArray(betLimits)) {
      // skip when not initialized.
      return;
    }

    if (typeof betAmount === 'string' && !isNaN(parseFloat(betAmount))) {
      // check parsable type
      betAmount = parseFloat(betAmount);
    }

    if (typeof betAmount !== 'number' || betAmount === userGameOption.betAmount) {
      // final check
      return;
    }

    let finalBetAmount = betAmount;

    const minBet = betLimits[0];
    const maxBet = betLimits[1];

    if (ethBalance.formatted < minBet) {
      setBetAmount(0);
      return;
    }

    if (!finalBetAmount) {
      finalBetAmount = Math.max(minBet, INITIAL_BET_AMOUNT);
    }

    if (finalBetAmount < minBet) {
      finalBetAmount = minBet;
    }

    if (ethBalance.formatted < finalBetAmount) {
      finalBetAmount = floorNumber(ethBalance.formatted);
    }

    if (maxBet < finalBetAmount) {
      finalBetAmount = maxBet;
    }

    setBetAmount(floorNumber(finalBetAmount));
  };

  useEffect(() => {
    setConvertedBetAmount(userGameOption.betAmount);
  }, [userGameOption.betAmount]);

  return (
    <div className="flex flex-row items-center px-10">
      <div className="flex items-center justify-between w-8/12 flex-wrap pl-14">
        <div className="flex flex-col space-y-2 w-1/3 mt-6">
          <div className="flex flex-row min-h-[28px]">
            <CheckBox
              checked={autoFlip}
              onChange={() => () => {
                // TODO: Implement auto flip
              }}
              className="w-[16px] h-[16px]"
            />
            <label className="text-gray-500">
              AUTOBET{' '}
              <b className={repeatTrying > 0 ? 'animate-pulse text-yellow-300' : 'text-sm'}>
                {repeatTrying > 0 ? '(tap spacebar)' : '(Coming Soon)'}
              </b>
            </label>
          </div>
          <SliderForm
            value={autoFlipCount}
            setValue={(v) => !isFlipping && setAutoFlipCount(v)}
            active={autoFlip}
          />
        </div>
        <div className="flex flex-col space-y-2 w-1/3 mt-6">
          <label className="text-gray-300 min-h-[28px]">COINS AMOUNT</label>
          <SliderForm
            value={userGameOption.coinCount}
            setValue={(v) => !isFlipping && setCoinCount(v)}
          />
        </div>

        <div className="flex flex-col space-y-2 w-1/3 mt-6">
          <div className="flex flex-row justify-between min-h-[28px]">
            <label className="text-gray-300">WAGER</label>
            <button
              onClick={() => !isFlipping && setConvertedBetAmount(balance)}
              className="w-[82px] h-[28px] mr-2
                bg-[url('/images/replaces/btn_max.png')] bg-contain bg-no-repeat bg-center
                hover:opacity-90 active:opacity-70 transition-opacity
                active:bg-[url('/images/middle/buttons/btn_max_pressed.png')]"
              aria-label="Max Bet"
            ></button>
          </div>
          <InputForm
            value={userGameOption.betAmount}
            setValue={(v) => !isFlipping && setConvertedBetAmount(v)}
            disabled={isFlipping}
          />
        </div>

        <div className="flex flex-col space-y-2 w-1/3 mt-10">
          <label className="text-gray-300 min-h-[28px]">PRESETS</label>
          <SelectForm />
        </div>

        <div className="flex flex-col space-y-2 w-1/3 mt-10">
          <label className="text-gray-300 min-h-[28px]">MIN HEADS / TAILS</label>
          <SliderForm
            value={userGameOption.minHeads}
            setValue={(v) => !isFlipping && setMinHeads(v)}
            max={userGameOption.coinCount}
          />
        </div>
        <div className="flex flex-col space-y-2 w-1/3 mt-10">
          <label className="text-gray-300 min-h-[28px]">POTENTIAL WIN</label>
          <TextForm value={expectedValue} />
        </div>
      </div>

      <div className="flex justify-center items-center w-4/12 flex-wrap relative">
        <div className="flex flex-col items-center pt-[40px]">
          <label className="block text-left absolute top-[25px] left-[42px] text-gray-300">
            PICK SIDE
          </label>
          <div className="flex flex-row items-center gap-4 w-full py-2 mt-2">
            <div className="flex flex-col items-center">
              <div className="w-[8px] h-[8px] relative">
                {userGameOption.selectedSide === 'HEADS' ? (
                  <Image
                    className="w-full"
                    src="/images/middle/coins/ic_front_selected.png"
                    alt="HEADS"
                  />
                ) : (
                  <>&nbsp;</>
                )}
              </div>
              <div className="w-[124px] h-[124px]">
                <Image
                  src={
                    userGameOption.selectedSide === 'HEADS'
                      ? '/images/middle/coins/img_koala-coin_front_124px.png'
                      : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                  }
                  alt="HEADS"
                  width={124}
                  height={124}
                  className={`cursor-pointer
            ${userGameOption.selectedSide === 'HEADS' ? 'transform scale-[1.3]' : ''}`}
                  onClick={() => !isFlipping && setSelectedSide('HEADS')}
                  style={{ opacity: isFlipping ? 0.5 : 1 }}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              {userGameOption.selectedSide === 'TAILS' ? (
                <Image
                  src="/images/middle/coins/ic_back_selected.png"
                  alt="TAILS"
                  width={8}
                  height={8}
                />
              ) : (
                <div className="w-[8px] h-[8px]">&nbsp;</div>
              )}
              <div className="w-[124px] h-[124px]">
                <Image
                  src={
                    userGameOption.selectedSide === 'TAILS'
                      ? '/images/middle/coins/img_koala-coin_back_124px.png'
                      : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                  }
                  alt="TAILS"
                  width={124}
                  height={124}
                  className={`cursor-pointer
            ${userGameOption.selectedSide === 'TAILS' ? 'transform scale-[1.3]' : ''}`}
                  onClick={() => !isFlipping && setSelectedSide('TAILS')}
                  style={{ opacity: isFlipping ? 0.5 : 1 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center mt-[10px]">
          <PanelButton
            onClick={onFlip}
            disabled={
              disabled || !userGameOption.selectedSide || isFlipping || !userGameOption.betAmount
            }
            disabledText={
              isFlipping
                ? 'TOSSING...'
                : userGameOption.betAmount
                  ? 'WAGER IS NOT SET'
                  : 'TOSS OPTION DISABLED'
            }
            textClassName=""
            className="w-[258px] h-[52px]"
          >
            TOSS {userGameOption.coinCount > 1 ? 'COINS' : 'COIN'} -{' '}
            <Image
              src="/images/ethereum-svgrepo-com.svg"
              alt="ETH"
              width={16}
              height={16}
              className="my-auto inline mb-[2px]"
            />{' '}
            {userGameOption.betAmount}
          </PanelButton>
        </div>
      </div>
    </div>
  );
};

export default Settings;
