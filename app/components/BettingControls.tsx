interface BettingControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  maxBet: number;
}

export const BettingControls = ({ betAmount, setBetAmount, maxBet }: BettingControlsProps) => {
  const adjustBet = (amount: number) => {
    const newBet = Math.min(Math.max(1, amount), maxBet);
    setBetAmount(newBet);
  };

  return (
    <div className="flex items-center gap-4 justify-center">
      <button
        className="w-10 h-10 rounded-lg bg-[#3498db] hover:bg-[#2980b9] active:bg-[#1f6dad] disabled:bg-[#95a5a6]"
        onClick={() => adjustBet(betAmount - 1)}
        disabled={betAmount <= 1}
      >
        -
      </button>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => adjustBet(parseInt(e.target.value) || 1)}
        className="w-24 h-9 text-center rounded bg-gray-700"
        min={1}
        max={maxBet}
      />

      <button
        className="w-10 h-10 rounded-lg bg-[#3498db] hover:bg-[#2980b9] active:bg-[#1f6dad] disabled:bg-[#95a5a6]"
        onClick={() => adjustBet(betAmount + 1)}
        disabled={betAmount >= maxBet}
      >
        +
      </button>

      <div className="text-lg font-mono">Current Bet: {betAmount} FCT</div>
    </div>
  );
};
