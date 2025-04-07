'use client';

import { useEffect, useState } from 'react';
import { Image } from './image';

interface StarPosition {
  top: number;
  left: number;
  opacity: number;
}

export const Stars = () => {
  const [star1Positions, setStar1Positions] = useState<StarPosition[]>([]);
  const [star2Positions, setStar2Positions] = useState<StarPosition[]>([]);

  useEffect(() => {
    // Generate positions for star1
    const star1Pos = Array.from({ length: 10 }).map(() => ({
      top: Math.floor(Math.random() * 60),
      left: Math.floor(Math.random() * 100),
      opacity: Math.random() * 0.5 + 0.5,
    }));

    // Generate positions for star2
    const star2Pos = Array.from({ length: 10 }).map(() => ({
      top: Math.floor(Math.random() * 60),
      left: Math.floor(Math.random() * 100),
      opacity: Math.random() * 0.5 + 0.5,
    }));

    setStar1Positions(star1Pos);
    setStar2Positions(star2Pos);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {star1Positions.map((pos, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            opacity: pos.opacity,
          }}
        >
          <Image src={`/images/gif/star1.gif`} alt="Star" width={48} height={48} unoptimized />
        </div>
      ))}
      {star2Positions.map((pos, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            opacity: pos.opacity,
          }}
        >
          <Image src={`/images/gif/star2.gif`} alt="Star" width={48} height={48} unoptimized />
        </div>
      ))}
    </div>
  );
};
