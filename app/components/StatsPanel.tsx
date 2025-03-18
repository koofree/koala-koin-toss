import { useState } from 'react';

export const StatsPanel = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="w-1/5 bg-gray-800 p-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Session Statistics</h2>
        <div className="space-y-2 font-mono">
          <div>Win/Loss: 0/0</div>
          <div>Total Won: 0 FCT</div>
          <div>Best Streak: 0</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Animation</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={animationEnabled}
                onChange={(e) => setAnimationEnabled(e.target.checked)}
              />
              <span>Enabled</span>
            </div>
          </div>

          <div>
            <label className="block mb-2">Animation Speed</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(e.target.value as any)}
              className="w-full p-2 rounded bg-gray-700"
              disabled={!animationEnabled}
            >
              <option>Slow</option>
              <option>Normal</option>
              <option>Fast</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Sound</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
