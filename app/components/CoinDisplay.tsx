'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Image } from './image/image';

const MotionDiv = motion.div;

interface CoinDisplayProps {
  count: number;
  minHeads: number;
  isFlipping: boolean;
  results: Array<'HEADS' | 'TAILS' | null>;
  selectedSide: 'HEADS' | 'TAILS' | null;
  animationEnabled: boolean;
}

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
      className={`relative ${count === 1 ? 'w-[128px] h-[128px]' : 'w-[64px] h-[64px]'} ${
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
                  src="/images/middle/coins/img_koala-coin_front_124px-1.png"
                  alt="Coin Front"
                  width={count === 1 ? 128 : 64}
                  height={count === 1 ? 128 : 64}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Image
                  src="/images/middle/coins/img_koala-coin_back_124px-1.png"
                  alt="Coin Back"
                  width={count === 1 ? 128 : 64}
                  height={count === 1 ? 128 : 64}
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
                    ? '/images/middle/coins/img_koala-coin_front_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                : isResultHeads
                  ? selectedSide === 'HEADS'
                    ? '/images/middle/coins/img_koala-coin_front_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                  : selectedSide === 'TAILS'
                    ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                    : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
            }
            alt={isResultHeads ? 'Coin Front' : 'Coin Back'}
            width={count === 1 ? 128 : 64}
            height={count === 1 ? 128 : 64}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </MotionDiv>
  );
};

export const CoinDisplay = ({
  count,
  minHeads,
  isFlipping,
  results,
  selectedSide,
  animationEnabled,
}: CoinDisplayProps) => {
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
        results.map((result, idx) => ({ key: idx, result, isFlipping: isFlipping, isReady: true }))
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
        if (a.result === selectedSide && b.result !== selectedSide) {
          return -1; // a comes before b
        } else if (a.result !== selectedSide && b.result === selectedSide) {
          return 1; // b comes before a
        }
        return 0; // keep original order for equal cases
      });

      setCoinDisplay(coinDisplay);
      setSortedCoinDisplay(sortedCoinDisplay);
    }
  }, [results, isFlipping, selectedSide]);

  useEffect(() => {
    setCoinComponents(
      coinDisplay.map((display, idx) => {
        const isResultHeads = display.result === 'HEADS';
        const isReady = display.isReady;

        return (
          <Coin
            key={idx}
            idx={idx}
            count={count}
            minHeads={minHeads}
            isFlipping={isFlipping}
            isReady={isReady}
            isResultHeads={isResultHeads}
            selectedSide={selectedSide}
            animationEnabled={animationEnabled}
          />
        );
      })
    );
  }, [coinDisplay, isFlipping, selectedSide, animationEnabled]);

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center max-w-[400px] mx-auto">
      {coinComponents.sort((a, b) => {
        const aIndex = sortedCoinDisplay.findIndex((r) => r.key.toString() === a.key?.toString());
        const bIndex = sortedCoinDisplay.findIndex((r) => r.key.toString() === b.key?.toString());
        return aIndex - bIndex;
      })}
    </div>
  );
};
