import { useWriteContractSponsored } from '@abstract-foundation/agw-react';
import { useEffect, useRef, useState } from 'react';
import { createPublicClient, formatUnits, http, parseEther } from 'viem';
import { getGeneralPaymasterInput } from 'viem/zksync';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';

import { clientConfig, contractAddress, getGameNumber, koalaKoinTossV1Abi } from '@/config';
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
    functionName: 'gameOptions',
    args: [gameNumber], // gameId and betAmount in wei
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
    console.log('handleFlip!!!', selectedSide, isFlipping, balance, betAmount);
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
      functionName: 'bet_eth',
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
      console.log('game result not found');
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
        setGameNumber(gameNumber);
        setDisabled(false);
      } else {
        setGameNumber(-1);
        setDisabled(true);
      }
    }
  }, [coinCount, minHeads]);

  useEffect(() => {
    refetchGameOptions();
  }, [gameNumber]);

  useEffect(() => {
    if (gameOptions && Array.isArray(gameOptions)) {
      console.log('gameOptions', gameOptions);

      const winChance: bigint = gameOptions[4];
      setWinningProbability(Number(winChance) / 100_000_000);

      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: 'getPayout',
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
    if (!betAmount) {
      setBetAmount(0);
    }

    if (balance < betAmount) {
      setBetAmount(balance);
    }

    if (winningProbability > 0 && gameNumber >= 0) {
      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: 'getPayout',
          args: [gameNumber, parseEther(betAmount.toString())],
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

        <div className="flex justify-end pr-10">
          <div className="text-[9px] text-white flex items-center">ANIMATION</div>
          <Image
            src={
              animationEnabled
                ? '/images/middle/buttons/btn_toggle_on.png'
                : '/images/middle/buttons/btn_toggle_off.png'
            }
            alt={animationEnabled ? 'Toggle On' : 'Toggle Off'}
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="w-[30px] h-[12px] mx-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
