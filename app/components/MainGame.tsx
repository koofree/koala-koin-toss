import { useAbstractClient, useCreateSession } from '@abstract-foundation/agw-react';
import { useEffect, useState } from 'react';
import { createPublicClient, formatUnits, http, parseEther } from 'viem';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';

import {
  BUILD_TIME,
  clientConfig,
  contractAddress,
  environment,
  functionNames,
  koalaKoinTossV1Abi,
  paymasterAddress,
  POOL_EDGE_DISCRIMINATOR,
} from '@/config';
import { GameResult } from '@/types';
import { clearStoredSession } from '@/utils/clearStoredSession';
import { createAndStoreSession } from '@/utils/createAndStoreSession';
import { floorNumber } from '@/utils/floorNumber';
import { generateResult } from '@/utils/generators';
import { getStoredSession } from '@/utils/getStoredSession';
import { privateKeyToAccount } from 'viem/accounts';
import { getGeneralPaymasterInput } from 'viem/zksync';
import { CoinDisplay } from './CoinDisplay';
import { ControlPanel } from './ControlPanel';
import { Image } from './image/image';

const toBalance = (walletBalance?: { value: bigint; decimals: number }) => {
  return parseFloat(walletBalance ? formatUnits(walletBalance.value, walletBalance.decimals) : '0');
};

interface MainGameProps {
  walletBalance?: { value: bigint; decimals: number; symbol: string };
  refetchWalletBalance: () => void;
  myGameHistory: GameResult[];
  allGameHistory: GameResult[];
  userAddress?: `0x${string}`;
}

export const MainGame = ({
  myGameHistory,
  allGameHistory,
  walletBalance,
  refetchWalletBalance,
  userAddress,
}: MainGameProps) => {
  const [balance, setBalance] = useState(toBalance(walletBalance));
  const [betAmount, setBetAmount] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'HEADS' | 'TAILS' | null>('HEADS');
  const [results, setResults] = useState<Array<'HEADS' | 'TAILS' | null>>([null]);
  const [coinCount, setCoinCount] = useState(1);
  const [minHeads, setMinHeads] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [autoFlipCount, setAutoFlipCount] = useState(1);
  const [winningProbability, setWinningProbability] = useState(0);
  const [gameNumber, setGameNumber] = useState(0);
  const [repeatTrying, setRepeatTrying] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  // Create a public client to interact with the blockchain
  const publicClient = createPublicClient({
    ...clientConfig,
    transport: http(),
  });

  // Call the canPlaceBet view function to check if a bet can be placed
  const { data: gameOptions, refetch: refetchGameOptions } = useReadContract({
    address: contractAddress,
    abi: koalaKoinTossV1Abi,
    functionName: functionNames.getGameOptions,
    args: [gameNumber], // gameId and betAmount in wei
  });

  const { data: betLimits, refetch: refetchBetLimits } = useReadContract({
    address: contractAddress,
    abi: koalaKoinTossV1Abi,
    functionName: functionNames.getBetLimits,
    args: [gameNumber],
  });

  const [payout, setPayout] = useState<number>(0);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const [txError, setTxError] = useState<Error | undefined>(undefined);
  const [reward, setReward] = useState<number>(0);

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  const { data: abstractClient } = useAbstractClient();
  const { createSessionAsync } = useCreateSession();

  const handleCoinCountChange = (count: number) => {
    setCoinCount(count);
    setResults(Array(count).fill(null));
    if (minHeads > count) {
      setMinHeads(count);
    }
  };

  const handleFlip = async () => {
    // Initialize the win state
    setIsWin(null);
    setReward(0);

    if (!abstractClient || !userAddress || !selectedSide || isFlipping || balance < betAmount) {
      if (balance < betAmount) {
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
    const sendValue = parseEther(betAmount.toString());

    let result: `0x${string}` | undefined;
    try {
      const sessionClient = abstractClient.toSessionClient(sessionSigner, session);

      result = await sessionClient.writeContract({
        abi: koalaKoinTossV1Abi,
        account: sessionClient.account,
        chain: clientConfig.chain,
        address: contractAddress,
        functionName: functionNames.koinTossEth,
        args: [gameNumber],
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

  const checkResult = (
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
    setReward(gameResult.reward);
    setResults(
      generateResult({
        won: gameResult.won,
        selectedSide: selectedSide,
        coinCount: coinCount,
        minHeads: minHeads,
      })
    );

    refetchWalletBalance();
    setIsFlipping(false);
  };

  const [allGameOptions, setAllGameOptions] = useState<
    Array<
      [
        number, // gameId
        number, // coinCount
        number, // minHeads
        string, // prizePool
        number, // expectedRate
      ]
    >
  >([]);

  const getGameNumber = (coinCount: number, minHeads: number): number | undefined => {
    return allGameOptions.find((v) => v[1] === coinCount && v[2] === minHeads)?.[0];
  };

  const [initStarted, setInitStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(0);

  const initializeAllGameOptions = async () => {
    let storedAllGameOptionsUpdatedAt = localStorage.getItem('allGameOptionsUpdatedAt');
    let storedAllGameOptions = localStorage.getItem('allGameOptions');

    // check if the allGameOptions is outdated
    if (
      storedAllGameOptions &&
      storedAllGameOptionsUpdatedAt &&
      new Date(storedAllGameOptionsUpdatedAt) < new Date(BUILD_TIME)
    ) {
      localStorage.removeItem('allGameOptionsUpdatedAt');
      localStorage.removeItem('allGameOptions');
      storedAllGameOptions = null;
      storedAllGameOptionsUpdatedAt = null;
    }

    if (storedAllGameOptions) {
      setAllGameOptions(JSON.parse(storedAllGameOptions));
      setIsLoading(100);
      return;
    }

    const gameCount = await publicClient.readContract({
      address: contractAddress,
      abi: koalaKoinTossV1Abi,
      functionName: functionNames.getGameCount,
    });

    setIsLoading((prev) => prev + 1);

    const newAllGameOptions = [];
    const prizePoolMap: Record<number, unknown> = {};

    try {
      for (let i = 0; i < Number(gameCount); i++) {
        // Reference: /public/abis/KoalaKoinTossV1.json gameOptions()
        const gameOption = await publicClient.readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getGameOptions,
          args: [i],
        });
        setIsLoading((prev) => prev + 1);

        if (Array.isArray(gameOption)) {
          let prizePools = prizePoolMap[Number(gameOption[7])];
          if (!prizePools) {
            prizePools = await publicClient.readContract({
              address: contractAddress,
              abi: koalaKoinTossV1Abi,
              functionName: functionNames.getPrizePools,
              args: [Number(gameOption[7])],
            });

            prizePoolMap[Number(gameOption[7])] = prizePools;
          }

          if (
            Array.isArray(prizePools) &&
            gameOption[6] === true &&
            String(prizePools[1]).toUpperCase() === 'WETH'
          ) {
            newAllGameOptions.push([
              Number(gameOption[0]),
              Number(gameOption[1]),
              Number(gameOption[2]),
              String(prizePools[1]).toUpperCase(),
              floorNumber(
                Number(formatUnits(gameOption[5], 8)) * (1 - 0.035) * POOL_EDGE_DISCRIMINATOR,
                2
              ),
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading game options:', error);
    } finally {
      setIsLoading(100);
    }

    // Type assertion to fix the type error
    setAllGameOptions(newAllGameOptions as Array<[number, number, number, string, number]>);
    localStorage.setItem('allGameOptions', JSON.stringify(newAllGameOptions));
    localStorage.setItem('allGameOptionsUpdatedAt', new Date().toISOString());
  };

  useEffect(() => {
    if (isLoading === 0) {
      setIsLoading(1);
      initializeAllGameOptions();
    }
  }, [initStarted]);

  useEffect(() => {
    if (!transactionReceipt) return;

    if (!selectedSide) {
      alert('select side error');
      return;
    }

    checkResult(transactionReceipt, selectedSide);
  }, [myGameHistory, transactionReceipt]);

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

      refetchWalletBalance();
      setIsFlipping(false);
      if (repeatTrying > 0) {
        setRepeatTrying(repeatTrying + 1);
      }
    }
  }, [txError]);

  useEffect(() => {
    if (coinCount && minHeads) {
      const gameNumber = getGameNumber(coinCount, minHeads);
      if (gameNumber !== undefined) {
        setGameNumber(Number(gameNumber));
        setDisabled(false);
      } else {
        setGameNumber(-1);
        setDisabled(true);
      }
    }
  }, [coinCount, minHeads, allGameOptions, userAddress]);

  useEffect(() => {
    refetchGameOptions();
    refetchBetLimits();
  }, [gameNumber]);

  useEffect(() => {
    if (gameOptions && Array.isArray(gameOptions)) {
      const winChance: bigint = gameOptions[4];
      setWinningProbability(floorNumber(Number(winChance) / 1_000_000, 2));

      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getPayout,
          args: [gameNumber, parseEther(betAmount.toString())],
        })
        .then((r) => {
          if (Array.isArray(r)) {
            setPayout(floorNumber(Number(formatUnits(r[2], 18))));
          }
        });
    } else {
      setPayout(0);
    }

    // Initialize the win state
    setIsWin(null);
    setReward(0);
  }, [gameOptions]);

  useEffect(() => {
    if (!Array.isArray(betLimits)) {
      // betLimits is not an array. need to wait for the betLimits.
      return;
    }

    let finalBetAmount = betAmount;

    const minBet = floorNumber(Number(formatUnits(betLimits[0], 18)));
    const maxBet = floorNumber(Number(formatUnits(betLimits[1], 18)));

    if (balance < minBet) {
      setDisabled(true);
      return;
    }

    if (!betAmount) {
      finalBetAmount = minBet;
    }

    if (finalBetAmount < minBet) {
      finalBetAmount = minBet;
    }

    if (balance < finalBetAmount) {
      finalBetAmount = floorNumber(balance);
    }

    if (maxBet < betAmount) {
      finalBetAmount = maxBet;
    }

    setBetAmount(Number(finalBetAmount));

    if (winningProbability > 0 && gameNumber >= 0) {
      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getPayout,
          args: [gameNumber, parseEther(finalBetAmount.toString())],
        })
        .then((r) => {
          if (Array.isArray(r)) {
            setPayout(floorNumber(Number(formatUnits(r[2], 18))));
          }
        });
    }
  }, [betAmount, balance]);

  useEffect(() => {
    setBalance(toBalance(walletBalance));
  }, [walletBalance]);

  // Add this effect to catch unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('unhandledrejection', event);
      setIsFlipping(false);
      refetchWalletBalance();

      if (userAddress && event.reason instanceof Error) {
        if (event.reason.message.indexOf('Session data not found!') >= 0) {
          console.log('Session data not found! Creating new session...');
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    setInitStarted(true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="flex flex-col max-w-screen-xl min-w-[1280px] h-full">
      <div className="h-[35vh] flex items-center">
        <CoinDisplay
          count={coinCount}
          minHeads={minHeads}
          isFlipping={isFlipping}
          results={results}
          selectedSide={selectedSide}
          animationEnabled={animationEnabled}
          isWin={isWin}
          reward={reward}
        />
      </div>

      <div>
        {isLoading < 100 && (
          <div className="text-white mt-[100px] min-h-[200px]">
            <div className="flex justify-center items-center">
              <div id="loading-spinner" className="animate-spin">
                <Image src="/abs.svg" alt="Loading" width={40} height={40} />
              </div>
              <span className="ml-3">Loading game... ({isLoading}/100)</span>
            </div>
          </div>
        )}
        {isLoading >= 100 && (
          <ControlPanel
            selectedSide={selectedSide}
            setSelectedSide={setSelectedSide}
            isFlipping={isFlipping}
            autoFlip={autoFlip}
            setAutoFlip={setAutoFlip}
            onFlip={handleFlip}
            coinCount={coinCount}
            setCoinCount={handleCoinCountChange}
            minHeads={minHeads}
            setMinHeads={setMinHeads}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            balance={balance}
            autoFlipCount={autoFlipCount}
            setAutoFlipCount={setAutoFlipCount}
            winningProbability={winningProbability}
            expectedValue={payout}
            repeatTrying={repeatTrying}
            disabled={disabled}
            myGameHistory={myGameHistory}
            allGameHistory={allGameHistory}
            allGameOptions={allGameOptions}
            isHistoryOpen={isHistoryOpen}
            setIsHistoryOpen={setIsHistoryOpen}
          />
        )}

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
                  : '/images/middle/ic_trophy_28px.png'
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
                ? '/images/middle/buttons/btn_toggle_on.png'
                : '/images/middle/buttons/btn_toggle_off.png'
            }
            width={60}
            height={30}
            alt={animationEnabled ? 'Toggle On' : 'Toggle Off'}
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="mx-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
