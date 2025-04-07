import { Image } from '@/components/image/image';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const MotionDiv = motion.div;

export const SpinningCoin = ({ width, height }: { width: number; height: number }) => {
  const animationDuration = 2000;

  const [progress, setProgress] = useState(0);
  const className = `relative w-[${width}px] h-[${height}px]`;

  useEffect(() => {
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
  }, []);

  return (
    <MotionDiv className={className}>
      <div
        className="absolute inset-0 "
        style={{
          transform: `rotateY(${progress * 10}deg)`,
          transition: 'transform 0.1s linear',
          transformStyle: 'preserve-3d',
        }}
      >
        <>
          {(progress * 10) % 360 < 180 ? (
            <div className="absolute inset-0 backface-hidden">
              <Image
                src="/images/replaces/img_koala-coin_front_264px.png"
                alt="Coin Front"
                width={width}
                height={height}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <Image
                src="/images/middle/coins/img_koala-coin_back_124px-1.png"
                alt="Coin Back"
                width={width}
                height={height}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </>
      </div>
    </MotionDiv>
  );
};
