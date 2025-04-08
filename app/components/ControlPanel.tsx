import { Image } from '@/components/image/image';
import Histories from './panels/Histories';
import Settings from './panels/Settings';
import { TitlePanel } from './panels/TitlePanel';

interface ActionButtonsProps {
  isFlipping: boolean;
  autoFlip: boolean;
  setAutoFlip: (enabled: boolean) => void;
  onFlip?: () => void;
  autoFlipCount: number;
  setAutoFlipCount: (count: number) => void;
  balance: number;
  winningProbability: number;
  expectedValue: number;
  disabled: boolean;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const ControlPanel = ({
  isFlipping,
  autoFlip,
  onFlip,
  autoFlipCount = 1,
  setAutoFlipCount,
  balance,
  winningProbability,
  expectedValue,
  disabled,
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
                  relative
        "
    >
      <div className="absolute top-[-45px] left-[100px]">
        <Image src="/images/gif/bird.gif" alt="Star" width={60} height={70} />
      </div>
      <TitlePanel
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
          isFlipping={isFlipping}
          onFlip={onFlip}
          balance={balance}
          expectedValue={expectedValue}
          disabled={disabled}
        />
      ) : (
        <Histories />
      )}
    </div>
  );
};

ControlPanel.displayName = 'ActionButtons';
