import { useWriteContractSponsored } from '@abstract-foundation/agw-react';
import { useEffect, useRef, useState } from 'react';
import { createPublicClient, formatUnits, http, parseEther } from 'viem';
import { getGeneralPaymasterInput } from 'viem/zksync';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';

import {
  BUILD_TIME,
  clientConfig,
  contractAddress,
  functionNames,
  // getGameNumber,
  koalaKoinTossV1Abi,
} from '@/config';
import { GameResult } from '@/database';
import { generateResult } from '@/utils/generators';
import { ActionButtons } from './ActionButtons';
import { CoinDisplay } from './CoinDisplay';
import { Image } from './image/image';

const toBalance = (walletBalance?: { value: bigint; decimals: number }) => {
  return parseFloat(walletBalance ? formatUnits(walletBalance.value, walletBalance.decimals) : '0');
};

interface MainGameProps {
  walletBalance?: { value: bigint; decimals: number; symbol: string };
  refetchWalletBalance: () => void;
  myGameHistory: GameResult[];
}

export const MainGame = ({ myGameHistory, walletBalance, refetchWalletBalance }: MainGameProps) => {
  const [balance, setBalance] = useState(toBalance(walletBalance));
  const [betAmount, setBetAmount] = useState(1);
  const [selectedSide, setSelectedSide] = useState<'HEADS' | 'TAILS' | null>(null);
  const [results, setResults] = useState<Array<'HEADS' | 'TAILS' | null>>([null]);
  const [coinCount, setCoinCount] = useState(1);
  const [minHeads, setMinHeads] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [autoFlipCount, setAutoFlipCount] = useState(1);
  const [winningProbability, setWinningProbability] = useState(0);
  const [expectedValue, setExpectedValue] = useState(0);
  const [gameNumber, setGameNumber] = useState(0);
  const [repeatTrying, setRepeatTrying] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const flipRef = useRef<{ triggerFlip: () => boolean }>(null);

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

  const [payout, setPayout] = useState<number>();

  const {
    writeContractSponsored,
    data: transactionHash,
    error: txError,
  } = useWriteContractSponsored();

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  const handleCoinCountChange = (count: number) => {
    setCoinCount(count);
    setResults(Array(count).fill(null));
    if (minHeads > count) {
      setMinHeads(count);
    }
  };

  const handleFlip = async () => {
    if (!selectedSide || isFlipping || balance < betAmount) {
      if (balance < betAmount) {
        alert('Betting amount was over the your balance!');
      }
      return;
    }

    setIsFlipping(true);

    const sendValue = parseEther(betAmount.toString());

    writeContractSponsored({
      abi: koalaKoinTossV1Abi,
      address: contractAddress,
      functionName: functionNames.koinTossEth,
      args: [gameNumber],
      value: sendValue,
      paymaster: '0x5407B5040dec3D339A9247f3654E59EEccbb6391',
      paymasterInput: getGeneralPaymasterInput({
        innerInput: '0x',
      }),
      authorizationList: [],
    });
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

  const [allGameOptions, setAllGameOptions] = useState<Array<[number, number, number, string]>>([]);

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
    setAllGameOptions(newAllGameOptions as Array<[number, number, number, string]>);
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
  }, [coinCount, minHeads, allGameOptions]);

  useEffect(() => {
    refetchGameOptions();
    refetchBetLimits();
  }, [gameNumber]);

  useEffect(() => {
    if (gameOptions && Array.isArray(gameOptions)) {
      const winChance: bigint = gameOptions[4];
      setWinningProbability(Number(winChance) / 100_000_000);

      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getPayout,
          args: [gameNumber, parseEther(betAmount.toString())],
        })
        .then((r) => {
          if (Array.isArray(r)) {
            setPayout(Number(r[2]));
          }
        });
    } else {
      setPayout(0);
    }
  }, [gameOptions]);

  useEffect(() => {
    if (!Array.isArray(betLimits)) {
      // betLimits is not an array. need to wait for the betLimits.
      return;
    }

    let finalBetAmount = betAmount;

    const minBet = Number(Number(formatUnits(betLimits[0], 18)).toFixed(8));
    const maxBet = Number(Number(formatUnits(betLimits[1], 18)).toFixed(8));

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
      finalBetAmount = balance;
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
            setPayout(Number(r[2]));
          }
        });
    }
  }, [betAmount, balance]);

  useEffect(() => {
    if (payout !== undefined) {
      setExpectedValue(Number(Number(formatUnits(BigInt(payout), 18)).toFixed(8)));
    }
  }, [payout]);

  useEffect(() => {
    setBalance(toBalance(walletBalance));
  }, [walletBalance]);

  // Add this effect to catch unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('unhandledrejection', event);
      setIsFlipping(false);
      refetchWalletBalance();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    setInitStarted(true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="w-full h-full p-5 pt-8 flex flex-col">
      <div className="h-[25vh] flex items-center">
        <CoinDisplay
          count={coinCount}
          isFlipping={isFlipping}
          results={results}
          selectedSide={selectedSide}
          animationEnabled={animationEnabled}
        />
      </div>

      <div className="space-y-4">
        {isLoading < 100 && (
          <div className="text-white mt-[100px] min-h-[200px]">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              <span className="ml-3">Loading game... ({isLoading}/100)</span>
            </div>
          </div>
        )}
        {isLoading >= 100 && (
          <ActionButtons
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
            expectedValue={expectedValue}
            repeatTrying={repeatTrying}
            disabled={disabled}
            ref={flipRef}
          />
        )}

        <div className="flex justify-end pr-10">
          <div className="text-[9px] text-white flex items-center">ANIMATION</div>
          <Image
            src={
              animationEnabled
                ? '/images/middle/buttons/btn_toggle_on.png'
                : '/images/middle/buttons/btn_toggle_off.png'
            }
            width={30}
            height={12}
            alt={animationEnabled ? 'Toggle On' : 'Toggle Off'}
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="mx-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
