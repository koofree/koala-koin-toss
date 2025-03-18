interface GameModeControlsProps {
  coinCount: number;
  setCoinCount: (count: number) => void;
  minHeads: number;
  setMinHeads: (count: number) => void;
}

export const GameModeControls = ({
  coinCount,
  setCoinCount,
  minHeads,
  setMinHeads,
}: GameModeControlsProps) => {
  const handleCoinCountChange = (count: number) => {
    setCoinCount(count);
    if (minHeads > count) {
      setMinHeads(count);
    }
  };

  return (
    <div className="flex items-center gap-6 justify-center">
      <div>
        <label className="block mb-2">Number of Coins</label>
        <select
          value={coinCount}
          onChange={(e) => handleCoinCountChange(parseInt(e.target.value))}
          className="w-32 h-9 rounded bg-gray-700 px-2"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'Coin' : 'Coins'}
            </option>
          ))}
        </select>
      </div>

      {coinCount > 1 && (
        <div>
          <label className="block mb-2">Minimum Heads Required</label>
          <input
            type="number"
            value={minHeads}
            onChange={(e) =>
              setMinHeads(Math.min(coinCount, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="w-32 h-9 rounded bg-gray-700 px-2 text-center"
            min={1}
            max={coinCount}
          />
        </div>
      )}
    </div>
  );
};
