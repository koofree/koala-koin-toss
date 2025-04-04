import { GameResult } from '@/types';
import Histories from './panels/Histories';
import Settings from './panels/Settings';
import { TitlePanel } from './panels/TitlePanel';

interface ActionButtonsProps {
  selectedSide: 'HEADS' | 'TAILS' | null;
  setSelectedSide: (side: 'HEADS' | 'TAILS' | null) => void;
  isFlipping: boolean;
  autoFlip: boolean;
  setAutoFlip: (enabled: boolean) => void;
  onFlip?: () => void;
  coinCount: number;
  setCoinCount: (count: number) => void;
  minHeads: number;
  setMinHeads: (count: number) => void;
  autoFlipCount: number;
  setAutoFlipCount: (count: number) => void;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  balance: number;
  winningProbability: number;
  expectedValue: number;
  repeatTrying: number;
  disabled: boolean;
  myGameHistory: GameResult[];
  allGameHistory: GameResult[];
  allGameOptions: Array<[number, number, number, string, number]>;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const ControlPanel = ({
  selectedSide,
  setSelectedSide,
  isFlipping,
  autoFlip,
  onFlip,
  coinCount,
  setCoinCount,
  minHeads,
  setMinHeads,
  autoFlipCount = 1,
  setAutoFlipCount,
  betAmount,
  setBetAmount,
  balance,
  winningProbability,
  expectedValue,
  repeatTrying,
  disabled,
  myGameHistory,
  allGameHistory,
  allGameOptions,
  isHistoryOpen,
  setIsHistoryOpen,
}: ActionButtonsProps) => {
  return (
    <div
      className="
                  flex flex-col items-center
                  h-[450px]
                  bg-[url('/images/middle/img_main-board.png')] 
                  bg-cover bg-center bg-no-repeat 
        "
    >
      <TitlePanel
        selectedSide={selectedSide}
        coinCount={coinCount}
        minHeads={minHeads}
        winningProbability={winningProbability}
        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />
      {!isHistoryOpen ? (
        <Settings
          autoFlip={autoFlip}
          setAutoFlip={() => {}}
          autoFlipCount={autoFlipCount}
          setAutoFlipCount={setAutoFlipCount}
          selectedSide={selectedSide}
          setSelectedSide={setSelectedSide}
          isFlipping={isFlipping}
          onFlip={onFlip}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          balance={balance}
          minHeads={minHeads}
          setMinHeads={setMinHeads}
          coinCount={coinCount}
          setCoinCount={setCoinCount}
          expectedValue={expectedValue}
          disabled={disabled}
          repeatTrying={repeatTrying}
        />
      ) : (
        <Histories
          myGameHistory={myGameHistory}
          allGameHistory={allGameHistory}
          allGameOptions={allGameOptions}
        />
      )}
    </div>
  );
};

ControlPanel.displayName = 'ActionButtons';
