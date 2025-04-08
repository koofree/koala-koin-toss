import { useAbstractClient, useCreateSession } from '@abstract-foundation/agw-react';
import { useEffect, useState } from 'react';
import { formatUnits, parseEther, TransactionReceipt } from 'viem';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

import {
  clientConfig,
  contractAddress,
  environment,
  functionNames,
  INITIAL_BET_AMOUNT,
  koalaKoinTossV1Abi,
  paymasterAddress,
} from '@/config';
import { useBalance } from '@/hooks/useBalance';
import { useGameHistory } from '@/hooks/useGameHistory';
import { usePublicClientStore } from '@/store/usePublicClientStore';

import { useGameOptionsStore } from '@/store/useGameOptionsStore';
import { useUserGameOptionStore } from '@/store/useUserGameOptionStore';
import { GameOption } from '@/types';
import { clearStoredSession } from '@/utils/clearStoredSession';
import { createAndStoreSession } from '@/utils/createAndStoreSession';
import { roundNumber } from '@/utils/floorNumber';
import { generateResult } from '@/utils/generators';
import { getErc20Transfer } from '@/utils/getLogs';
import { getStoredSession } from '@/utils/getStoredSession';
import { privateKeyToAccount } from 'viem/accounts';
import { getGeneralPaymasterInput } from 'viem/zksync';
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
  const { ethBalance, refetch } = useBalance();
  const { myGameHistory } = useGameHistory(userAddress);

  const [results, setResults] = useState<Array<'HEADS' | 'TAILS' | null>>([null]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [autoFlipCount, setAutoFlipCount] = useState(1);
  const [winningProbability, setWinningProbability] = useState(0);
  const [repeatTrying, setRepeatTrying] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const playMusic = () => {
    const audio = new Audio('/sounds/8bit-mix-56351.mp3');
    audio.addEventListener('ended', () => {
      const nextAudio = new Audio('/sounds/8-bit-heaven-26287.mp3');
      nextAudio.addEventListener('ended', () => {
        if (animationEnabled) {
          playMusic();
        }
      });
      setAudioRef(nextAudio);
      nextAudio.play().catch((err) => console.error('Error playing audio:', err));
    });
    setAudioRef(audio);
    audio.play().catch((err) => console.error('Error playing audio:', err));
  };

  useEffect(() => {
    if (animationEnabled === true) {
      playMusic();
    } else {
      // Stop the music when animation is disabled
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
        setAudioRef(null);
      }
    }

    // Cleanup function to stop audio when component unmounts or animation state changes
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };
  }, [animationEnabled]);

  const { loadingProgress, initializeAllGameOptions } = useGameOptionsStore();
  const { gameId, userGameOption, setOption, setBetAmount, setSelectedSide } =
    useUserGameOptionStore();

  const [payout, setPayout] = useState<number>(0);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const [txError, setTxError] = useState<Error | undefined>(undefined);
  const [reward, setReward] = useState<number>(0);

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  const { data: abstractClient } = useAbstractClient();
  const { createSessionAsync } = useCreateSession();

  const handleFlip = async () => {
    // Initialize the win state
    setIsWin(null);
    setReward(0);

    if (
      !abstractClient ||
      !userAddress ||
      isFlipping ||
      ethBalance.formatted < userGameOption.betAmount
    ) {
      if (ethBalance.formatted < userGameOption.betAmount) {
        alert('Betting amount was over the your balance!');
      }

      setIsFlipping(false);
      return;
    }

    setIsFlipping(true);

    const sessionData = await getStoredSession(userAddress, abstractClient, createSessionAsync);
    if (!sessionData) {
      createAndStoreSession(userAddress, createSessionAsync);
      setIsFlipping(false);
      return;
    }

    const { session, privateKey } = sessionData;
    const sessionSigner = privateKeyToAccount(privateKey);
    const sendValue = parseEther(userGameOption.betAmount.toString());

    let result: `0x${string}` | undefined;
    try {
      const sessionClient = abstractClient.toSessionClient(sessionSigner, session);

      result = await sessionClient.writeContract({
        abi: koalaKoinTossV1Abi,
        account: sessionClient.account,
        chain: clientConfig.chain,
        address: contractAddress,
        functionName: functionNames.koinTossEth,
        args: [gameId],
        value: sendValue,
        paymaster: paymasterAddress,
        paymasterInput: getGeneralPaymasterInput({
          innerInput: '0x',
        }),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setTxError(error);
      } else {
        setTxError(new Error(String(error)));
      }
    }

    setTransactionHash(result);
  };

  const checkResult = async (
    transactionReceipt: { transactionHash: string },
    selectedSide: 'HEADS' | 'TAILS'
  ) => {
    const gameResult = myGameHistory.find(
      (v) => v.commitTransactionHash === transactionReceipt.transactionHash
    );

    if (!gameResult) {
      // game result not found in the history. need to wait for the result.
      return;
    }

    setIsWin(gameResult.won);
    if (gameResult.won) {
      setReward(gameResult.reward);
    } else {
      const receipt: TransactionReceipt = (await publicClient.getTransactionReceipt({
        hash: gameResult.revealTransactionHash,
      })) as TransactionReceipt;

      const reward: number | undefined =
        receipt && userAddress ? await getErc20Transfer(receipt, userAddress) : undefined;

      setReward(reward ? reward : 0);
    }

    setResults(
      generateResult({
        won: gameResult.won,
        selectedSide: selectedSide,
        coinCount: userGameOption.coinCount,
        minHeads: userGameOption.minHeads,
      })
    );

    refetch();
    setIsFlipping(false);
  };

  const applyGameOption = (gameOption?: GameOption) => {
    if (gameOption && Array.isArray(gameOption)) {
      setWinningProbability(gameOption[5]);

      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getPayout,
          args: [gameOption[0], parseEther(userGameOption.betAmount.toString())],
        })
        .then((r) => {
          if (Array.isArray(r)) {
            setPayout(roundNumber(Number(formatUnits(r[2], 18))));
          }
        });
    } else {
      setPayout(0);
    }
  };

  // Initialize the game options
  useEffect(() => {
    initializeAllGameOptions(publicClient);
  }, []);

  // After loading complete, set the initial game options
  useEffect(() => {
    if (loadingProgress === 100) {
      setOption({ coinCount: 1, minHeads: 1 });
      setBetAmount(INITIAL_BET_AMOUNT);
      setSelectedSide('HEADS');
    }
  }, [loadingProgress === 100]);

  // When game option is changed
  useEffect(() => {
    applyGameOption(userGameOption.option);
    setDisabled(userGameOption.option === undefined);

    // Initialize the win state
    setIsWin(null);
    setReward(0);
  }, [gameId]);

  useEffect(() => {
    applyGameOption(userGameOption.option);
  }, [userGameOption.betAmount]);

  // When receive game result by transaction receipt, check the result
  useEffect(() => {
    if (!transactionReceipt) return;

    checkResult(transactionReceipt, userGameOption.selectedSide);
  }, [myGameHistory, transactionReceipt]);

  // When there is an error in transaction, handle it
  useEffect(() => {
    if (txError) {
      console.error('txError', txError);
      if (txError.message.indexOf('Bet exceeds max reward limit') >= 0) {
        alert('Bet exceeds max reward limit!');
      } else if (
        txError.message.indexOf(
          'An unknown error occurred while executing the contract function'
        ) >= 0
      ) {
        alert(
          'Contract function execution failed. The session will be cleared and retried. If the issue persists, please stop the game for safety reasons.'
        );
        if (userAddress) {
          clearStoredSession(userAddress).then(() => {
            createAndStoreSession(userAddress, createSessionAsync);
          });
        }
      } else {
        if (environment !== 'production') {
          alert(txError.message);
        } else {
          alert('An unknown error occurred while executing the contract function');
        }
      }

      refetch && refetch();
      setIsFlipping(false);
      if (repeatTrying > 0) {
        setRepeatTrying(repeatTrying + 1);
      }
    }
  }, [txError]);

  // Add this effect to catch unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('unhandledrejection', event);
      setIsFlipping(false);
      refetch && refetch();

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
            repeatTrying={repeatTrying}
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
