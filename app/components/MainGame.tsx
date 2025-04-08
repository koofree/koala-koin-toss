import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useBalance } from '@/hooks/useBalance';
import { usePublicClientStore } from '@/store/usePublicClientStore';

import { useBGM } from '@/hooks/useBGM';
import { useGamePlay } from '@/hooks/useGamePlay';
import { useGameOptionsStore } from '@/store/useGameOptionsStore';
import { CoinDisplay } from './CoinDisplay';
import { ControlPanel } from './ControlPanel';
import { Image } from './image/image';
import { SpinningCoin } from './image/SpinningCoin';
interface MainGameProps {}

export const MainGame = ({}: MainGameProps) => {
  // Create a public client to interact with the blockchain
  const { publicClient } = usePublicClientStore();
  if (!publicClient) {
    return <></>;
  }

  const { address: userAddress } = useAccount();
  const { ethBalance } = useBalance();

  const [autoFlip, setAutoFlip] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [autoFlipCount, setAutoFlipCount] = useState(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { playMusic, stopMusic } = useBGM();

  useEffect(() => {
    playMusic();

    return () => {
      stopMusic();
    };
  }, []);

  // Game states
  const { loadingProgress, initializeAllGameOptions } = useGameOptionsStore();
  const {
    winningProbability,
    payout,
    disabled,
    isFlipping,
    results,
    isWin,
    reward,
    handleFlip,
    interruptGamePlay,
    initGamePlay,
  } = useGamePlay({
    userAddress,
    publicClient,
  });

  // Initialize the game options
  useEffect(() => {
    initializeAllGameOptions(publicClient);
  }, []);

  // After loading complete, set the initial game options
  useEffect(() => {
    if (loadingProgress === 100) {
      initGamePlay();
    }
  }, [loadingProgress === 100]);

  // Add this effect to catch unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('unhandledrejection', event);
      interruptGamePlay();

      if (userAddress && event.reason instanceof Error) {
        if (event.reason.message.indexOf('Session data not found!') >= 0) {
          console.log('Session data not found! Creating new session...');
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="flex flex-col max-w-screen-xl min-w-[1280px] h-full z-10">
      <div className="h-[35vh] min-h-[300px] flex items-center">
        <CoinDisplay
          isFlipping={isFlipping}
          results={results}
          animationEnabled={animationEnabled}
          isWin={isWin}
          reward={reward}
        />
      </div>

      <div className="flex flex-col justify-center min-h-[600px]">
        {loadingProgress < 100 && (
          <div className="text-white mt-[100px] min-h-[200px]">
            <div className="flex flex-row justify-center items-center space-x-4">
              <SpinningCoin width={60} height={60} />
              <div>
                <span className="text-2xl ml-3">Loading game... ({loadingProgress}/100)</span>
              </div>
            </div>
          </div>
        )}
        {loadingProgress >= 100 && (
          <ControlPanel
            isFlipping={isFlipping}
            autoFlip={autoFlip}
            setAutoFlip={setAutoFlip}
            onFlip={handleFlip}
            balance={ethBalance.formatted}
            autoFlipCount={autoFlipCount}
            setAutoFlipCount={setAutoFlipCount}
            winningProbability={winningProbability}
            expectedValue={payout}
            disabled={disabled}
            isHistoryOpen={isHistoryOpen}
            setIsHistoryOpen={setIsHistoryOpen}
          />
        )}
        {loadingProgress >= 100 && (
          <div className="flex justify-end pr-20 pt-2">
            <div className="flex items-center mr-6 cursor-pointer">
              <div
                className="text-white flex items-center font-['Press_Start_2P'] text-sm"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              >
                {isHistoryOpen ? 'RETURN TO GAME' : 'WIN HISTORY'}
              </div>
              <Image
                src={
                  isHistoryOpen
                    ? '/images/middle/back_button.png'
                    : '/images/replaces/ic_trophy_28px.png'
                }
                width={28}
                height={24}
                alt={'WIN HISTORY'}
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="mx-2"
              />
            </div>
            <div className="text-white flex items-center font-['Press_Start_2P'] text-sm">
              ANIMATION
            </div>
            <Image
              src={
                animationEnabled
                  ? '/images/replaces/btn_toggle_on.png'
                  : '/images/replaces/btn_toggle_off.png'
              }
              width={60}
              height={30}
              alt={animationEnabled ? 'Toggle On' : 'Toggle Off'}
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="mx-2 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
