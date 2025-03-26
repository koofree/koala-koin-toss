import { useState } from 'react';

interface BettingControlsProps {
  onAnimationToggle: (enabled: boolean) => void;
}

export function BettingControls({ onAnimationToggle }: BettingControlsProps) {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  const handleAnimationToggle = (enabled: boolean) => {
    // Handle animation state change
    console.log('Animation enabled:', enabled);
  };

  return (
    <div className="flex justify-between items-center w-full p-4">
      {/* Left side - Game Mode Controls */}
      <div className="flex items-center">
        <button
          onClick={() => handleAnimationToggle(true)}
          className={`px-4 py-2 rounded ${
            isAnimationEnabled ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          } hover:opacity-90 transition-all`}
        >
          {isAnimationEnabled ? 'Animation ON' : 'Animation OFF'}
        </button>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all">
          FLIP
        </button>
      </div>
    </div>
  );
}
