import { forwardRef, useState } from 'react';

import { GameResult } from '@/database';
import { TitlePanel } from './forms/TitlePanel';
import Histories from './panels/Histories';
import Settings from './panels/Settings';

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
  allGameOptions: Array<[number, number, number, string]>;
  ref?: React.ForwardedRef<{ triggerFlip: () => boolean }>;
}

export const ControlPanel = forwardRef(
  ({
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
  }: ActionButtonsProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
      <div
        className="h-[260px] mx-[-10px] 
                  bg-[url('/images/middle/img_main-board.png')] 
                  bg-cover bg-center bg-no-repeat 
                  rounded-lg 
                  flex flex-col items-center"
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
  }
);

ControlPanel.displayName = 'ActionButtons';
