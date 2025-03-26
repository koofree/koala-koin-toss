import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CoinDisplayProps {
  count: number;
  isFlipping: boolean;
  results: Array<'HEADS' | 'TAILS'>;
  selectedSide: 'HEADS' | 'TAILS' | null;
  animationSpeed?: 'Slow' | 'Normal' | 'Fast';
}

export const CoinDisplay = ({
  count,
  isFlipping,
  results,
  selectedSide,
  animationSpeed = 'Normal',
}: CoinDisplayProps) => {
  const [progress, setProgress] = useState(0);

  const animationDuration = {
    Slow: 3000,
    Normal: 2000,
    Fast: 1000,
  }[animationSpeed];

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
    <div className="flex flex-wrap gap-4 justify-center items-center max-w-[400px] mx-auto">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`relative ${count === 1 ? 'w-[264px] h-[264px]' : 'w-[128px] h-[128px]'} ${
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
            <div className="absolute inset-0 backface-hidden">
              <Image
                src="/images/header/img_koala-coin_front_264px.png"
                alt="Coin Front"
                width={count === 1 ? 264 : 128}
                height={count === 1 ? 264 : 128}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <Image
                src="/images/header/img_koala-coin_back_264px.png"
                alt="Coin Back"
                width={count === 1 ? 264 : 128}
                height={count === 1 ? 264 : 128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
