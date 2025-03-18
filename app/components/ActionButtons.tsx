interface ActionButtonsProps {
  selectedSide: 'HEADS' | 'TAILS' | null;
  setSelectedSide: (side: 'HEADS' | 'TAILS' | null) => void;
  isFlipping: boolean;
  autoFlip: boolean;
  setAutoFlip: (enabled: boolean) => void;
  onFlip?: () => void;
}

export const ActionButtons = ({
  selectedSide,
  setSelectedSide,
  isFlipping,
  autoFlip,
  setAutoFlip,
  onFlip,
}: ActionButtonsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <button
          className={`w-[150px] h-10 rounded-lg font-bold ${
            selectedSide === 'HEADS'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          onClick={() => setSelectedSide('HEADS')}
          disabled={isFlipping}
        >
          HEADS
        </button>

        <button
          className={`w-[150px] h-10 rounded-lg font-bold ${
            selectedSide === 'TAILS'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          onClick={() => setSelectedSide('TAILS')}
          disabled={isFlipping}
        >
          TAILS
        </button>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="w-[200px] h-10 rounded-lg bg-green-600 hover:bg-green-700 font-bold disabled:bg-gray-600"
          onClick={onFlip}
          disabled={!selectedSide || isFlipping}
        >
          FLIP
        </button>

        <button
          className={`w-[100px] h-10 rounded-lg font-bold ${
            autoFlip ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => setAutoFlip(!autoFlip)}
          disabled={isFlipping && !autoFlip}
        >
          {autoFlip ? 'STOP' : 'AUTO'}
        </button>
      </div>
    </div>
  );
};
