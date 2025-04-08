'use client';

import { kpSymbol } from '@/config';
import { useUserGameOptionStore } from '@/store/useUserGameOptionStore';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Image } from './image/image';

const MotionDiv = motion.div;

interface CoinProps {
  idx: number;
  count: number;
  minHeads: number;
  isFlipping: boolean;
  selectedSide: 'HEADS' | 'TAILS' | null;
  isReady: boolean;
  isResultHeads: boolean;
  animationEnabled: boolean;
}

const Coin = ({
  idx,
  count,
  minHeads,
  isFlipping,
  isReady,
  isResultHeads,
  selectedSide,
  animationEnabled,
}: CoinProps) => {
  const [progress, setProgress] = useState(0);

  const animationDuration = animationEnabled ? 2000 : 0;

  useEffect(() => {
    if (isFlipping) {
      // Increase the step size to make the flipping speed faster while keeping the same duration

      const flipCount = 100000;
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= flipCount) {
            clearInterval(interval);
            return 0;
          }
          return prev + 100 / (animationDuration / 50);
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isFlipping, animationDuration]);

  return (
    <MotionDiv
      key={idx}
      className={`relative ${count === 1 ? 'w-[264px] h-[264px]' : 'w-[128px] h-[128px]'} ${
        idx % 5 === 0 ? 'sm:basis-auto' : ''
      }`}
      layout
    >
      <div
        className="absolute inset-0"
        style={{
          transform: isFlipping ? `rotateY(${progress * 10}deg)` : 'none',
          transition: 'transform 0.1s linear',
          transformStyle: 'preserve-3d',
        }}
      >
        {isFlipping ? (
          <>
            {(progress * 10) % 360 < 180 ? (
              <div className="absolute inset-0 backface-hidden">
                <Image
                  src="/images/replaces/img_koala-coin_front_264px.png"
                  alt="Coin Front"
                  width={count === 1 ? 264 : 128}
                  height={count === 1 ? 264 : 128}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Image
                  src="/images/middle/coins/img_koala-coin_back_124px-1.png"
                  alt="Coin Back"
                  width={count === 1 ? 264 : 128}
                  height={count === 1 ? 264 : 128}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </>
        ) : (
          <Image
            src={
              isReady
                ? selectedSide === 'TAILS'
                  ? idx < minHeads
                    ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                  : idx < minHeads
                    ? '/images/replaces/img_koala-coin_front_264px.png'
                    : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                : isResultHeads
                  ? selectedSide === 'HEADS'
                    ? '/images/replaces/img_koala-coin_front_264px.png'
                    : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                  : selectedSide === 'TAILS'
                    ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
            }
            alt={isResultHeads ? 'Coin Front' : 'Coin Back'}
            width={count === 1 ? 264 : 128}
            height={count === 1 ? 264 : 128}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </MotionDiv>
  );
};

interface WinningMessageProps {
  payout: number;
  animationEnabled: boolean;
}

const WinningMessage = ({ payout, animationEnabled }: WinningMessageProps) => {
  useEffect(() => {
    if (animationEnabled) {
      const audio = new Audio('/sounds/win.mp3');
      audio.play();
    }
  }, []);

  return (
    <MotionDiv
      className="
            h-[350px]
            w-[700px]
            absolute flex flex-col items-center justify-center space-y-4
            bg-[url('/images/middle/ellipse_win.png')]
            bg-cover bg-center bg-no-repeat"
      layout="size"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      {/* border: 3px solid #EC6600 */}
      <p
        className="text-white text-4xl font-['Press_Start_2P'] text-stroke-2 text-stroke-yellow-500"
        style={{ WebkitTextStrokeColor: '#EC6600' }}
      >
        You Win!!
      </p>
      <p
        className="text-white text-[28px] font-['Press_Start_2P'] text-stroke-2 text-stroke-yellow-500"
        style={{ WebkitTextStrokeColor: '#EC6600' }}
      >
        + {payout} ETH
      </p>
    </MotionDiv>
  );
};

interface LosingMessageProps {
  payout: number;
  animationEnabled: boolean;
}

const LosingMessage = ({ payout, animationEnabled }: LosingMessageProps) => {
  useEffect(() => {
    if (animationEnabled) {
      const audio = new Audio('/sounds/lose.mp3');
      audio.play();
    }
  }, []);

  return (
    <MotionDiv
      className="
            h-[400px]
            w-[704px]
            absolute flex flex-col items-center justify-center space-y-4
            bg-[url('/images/middle/ellipse_lose.png')]
            bg-cover bg-center bg-no-repeat
            "
      layout="size"
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      {/* border: 3px solid #1A1A1A */}
      <p
        className="text-white text-4xl font-['Press_Start_2P'] text-stroke-2 text-stroke-zinc-900"
        style={{ WebkitTextStrokeColor: '#1A1A1A' }}
      >
        You Lose
      </p>
      <p
        className="text-white text-[28px] font-['Press_Start_2P'] text-stroke-2 text-stroke-zinc-900"
        style={{ WebkitTextStrokeColor: '#1A1A1A' }}
      >
        BUT YOU RECEIVED +{payout} {kpSymbol}
      </p>
    </MotionDiv>
  );
};

interface CoinDisplayProps {
  isFlipping: boolean;
  results: Array<'HEADS' | 'TAILS' | null>;
  animationEnabled: boolean;
  isWin: boolean | null;
  reward: number;
}

export const CoinDisplay = ({
  isFlipping,
  results,
  animationEnabled,
  isWin,
  reward: payout,
}: CoinDisplayProps) => {
  const { userGameOption } = useUserGameOptionStore();

  const [coinDisplay, setCoinDisplay] = useState<
    Array<{
      key: number;
      result: 'HEADS' | 'TAILS' | null;
      isFlipping: boolean;
      isReady: boolean;
    }>
  >([]);
  const [sortedCoinDisplay, setSortedCoinDisplay] = useState<
    Array<{
      key: number;
      result: 'HEADS' | 'TAILS' | null;
      isFlipping: boolean;
      isReady: boolean;
    }>
  >([]);

  const [coinComponents, setCoinComponents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (results.includes(null)) {
      setCoinDisplay(
        Array(userGameOption.coinCount)
          .fill(null)
          .map((_, idx) => ({ key: idx, result: null, isFlipping: isFlipping, isReady: true }))
      );
    } else {
      const coinDisplay = results.map((result, idx) => ({
        key: idx,
        result,
        isFlipping: isFlipping,
        isReady: false,
      }));
      const sortedCoinDisplay = [...coinDisplay].sort((a, b) => {
        // Sort coins with result matching selectedSide first
        if (a.result === userGameOption.selectedSide && b.result !== userGameOption.selectedSide) {
          return -1; // a comes before b
        } else if (
          a.result !== userGameOption.selectedSide &&
          b.result === userGameOption.selectedSide
        ) {
          return 1; // b comes before a
        }
        return 0; // keep original order for equal cases
      });

      setCoinDisplay(coinDisplay);
      setSortedCoinDisplay(sortedCoinDisplay);
    }
  }, [
    results,
    isFlipping,
    userGameOption.selectedSide,
    userGameOption.coinCount,
    userGameOption.minHeads,
  ]);

  useEffect(() => {
    setCoinComponents(
      coinDisplay.map((display, idx) => {
        const isResultHeads = display.result === 'HEADS';
        const isReady = display.isReady;

        return (
          <Coin
            key={idx}
            idx={idx}
            count={userGameOption.coinCount}
            minHeads={userGameOption.minHeads}
            isFlipping={isFlipping}
            isReady={isReady}
            isResultHeads={isResultHeads}
            selectedSide={userGameOption.selectedSide}
            animationEnabled={animationEnabled}
          />
        );
      })
    );
  }, [
    coinDisplay,
    isFlipping,
    userGameOption.selectedSide,
    userGameOption.coinCount,
    userGameOption.minHeads,
    animationEnabled,
  ]);

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center w-[704px] mx-auto relative">
      {coinComponents.sort((a, b) => {
        const aIndex = sortedCoinDisplay.findIndex((r) => r.key.toString() === a.key?.toString());
        const bIndex = sortedCoinDisplay.findIndex((r) => r.key.toString() === b.key?.toString());
        return aIndex - bIndex;
      })}
      {isWin === null ? (
        <></>
      ) : isWin ? (
        <WinningMessage payout={payout} animationEnabled={animationEnabled} />
      ) : (
        <LosingMessage payout={payout} animationEnabled={animationEnabled} />
      )}
    </div>
  );
};
