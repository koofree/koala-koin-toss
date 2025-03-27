import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CoinDisplayProps {
  count: number;
  isFlipping: boolean;
  results: Array<'HEADS' | 'TAILS'>;
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
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
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
    <div className="flex flex-wrap gap-4 justify-center items-center max-w-[600px] mx-auto">
      {Array.from({ length: count }).map((_, idx) => {
        const result = results[idx];
        const isHeads = result === 'HEADS';

        return (
          <div
            key={idx}
            className={`relative ${count === 1 ? 'w-[128px] h-[128px]' : 'w-[96px] h-[96px]'} ${
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
                        width={count === 1 ? 128 : 96}
                        height={count === 1 ? 128 : 96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <Image
                        src="/images/middle/coins/img_koala-coin_back_124px-1.png"
                        alt="Coin Back"
                        width={count === 1 ? 128 : 96}
                        height={count === 1 ? 128 : 96}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Image
                  src={
                    isHeads
                      ? selectedSide === 'HEADS'
                        ? '/images/middle/coins/img_koala-coin_front_124px-1.png'
                        : '/images/middle/coins/img_koala-coin_front_disabled_124px.png'
                      : selectedSide === 'TAILS'
                        ? '/images/middle/coins/img_koala-coin_back_124px-1.png'
                        : '/images/middle/coins/img_koala-coin_back_disabled_124px.png'
                  }
                  alt={isHeads ? 'Coin Front' : 'Coin Back'}
                  width={count === 1 ? 128 : 96}
                  height={count === 1 ? 128 : 96}
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
