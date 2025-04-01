import { useEffect, useState } from 'react';
import { Image } from './image/image';

interface CoinDisplayProps {
  count: number;
  isFlipping: boolean;
  results: Array<'HEADS' | 'TAILS' | null>;
  selectedSide: 'HEADS' | 'TAILS' | null;
  animationEnabled: boolean;
}

export const CoinDisplay = ({
  count,
  isFlipping,
  results,
  selectedSide,
  animationEnabled,
}: CoinDisplayProps) => {
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
    <div className="flex flex-wrap gap-2 justify-center items-center max-w-[400px] mx-auto">
      {Array.from({ length: count }).map((_, idx) => {
        const result = results[idx];
        const isHeads = result === 'HEADS';
        const isNull = result === null;

        return (
          <div
            key={idx}
            className={`relative ${count === 1 ? 'w-[128px] h-[128px]' : 'w-[64px] h-[64px]'} ${
              idx % 5 === 0 ? 'basis-full sm:basis-auto' : ''
            }`}
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
                    isNull
                      ? selectedSide === 'TAILS'
                        ? '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                        : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                      : isHeads
                        ? selectedSide === 'HEADS'
                          ? '/images/middle/coins/img_koala-coin_front_124px-1.png'
                          : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                        : selectedSide === 'TAILS'
                          ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                          : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                  }
                  alt={isHeads ? 'Coin Front' : 'Coin Back'}
                  width={count === 1 ? 128 : 64}
                  height={count === 1 ? 128 : 64}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
