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
          className={`relative ${count === 1 ? 'w-[120px] h-[120px]' : 'w-[60px] h-[60px]'} ${
            idx % 5 === 0 ? 'basis-full sm:basis-auto' : ''
          }`}
        >
          <div
            className={`absolute inset-0 rounded-full ${
              results[idx] === 'HEADS' ? 'bg-[#FFD700]' : 'bg-[#C0C0C0]'
            } flex items-center justify-center font-bold`}
            style={{
              transform: isFlipping ? `rotateX(${progress * 10}deg)` : 'none',
              transition: 'transform 0.1s linear',
            }}
          >
            {isFlipping
              ? '?'
              : results[idx]
                ? results[idx] === 'HEADS'
                  ? 'H'
                  : 'T'
                : selectedSide
                  ? selectedSide === 'HEADS'
                    ? 'H?'
                    : 'T?'
                  : '?'}
          </div>
          {isFlipping && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3498db"
                strokeWidth="4"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
