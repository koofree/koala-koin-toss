import { useEffect, useRef, useState } from 'react';
import { createPublicClient, encodeFunctionData, formatUnits, http, parseEther } from 'viem';
import { abstractTestnet } from 'viem/chains';
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { ActionButtons } from './ActionButtons';
import { CoinDisplay } from './CoinDisplay';

import { contractAddress, koalaKoinTossV1Abi } from '@/config';
import { GameResult } from '@/database';
import { generateResult } from '@/utils/generators';
import { useGlobalWalletSignerClient } from '@abstract-foundation/agw-react';

const toBalance = (walletBalance?: { value: bigint; decimals: number }) => {
  return parseFloat(walletBalance ? formatUnits(walletBalance.value, walletBalance.decimals) : '0');
};

interface MainGameProps {
  address?: `0x${string}`;
  walletBalance?: { value: bigint; decimals: number; symbol: string };
  refetchWalletBalance: () => void;
  myGameHistory: GameResult[];
}

export const MainGame = ({
  address,
  myGameHistory,
  walletBalance,
  refetchWalletBalance,
}: MainGameProps) => {
  const [balance, setBalance] = useState(toBalance(walletBalance));
  const [betAmount, setBetAmount] = useState(1);
  const [selectedSide, setSelectedSide] = useState<'HEADS' | 'TAILS' | null>(null);
  const [results, setResults] = useState<Array<'HEADS' | 'TAILS' | null>>([null]);
  const [coinCount, setCoinCount] = useState(1);
  const [minHeads, setMinHeads] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [isWinning, setIsWinning] = useState<boolean | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [autoFlipCount, setAutoFlipCount] = useState(1);
  const [winningProbability, setWinningProbability] = useState(0);
  const [expectedValue, setExpectedValue] = useState(0);
  const [gameNumber, setGameNumber] = useState(0);
  const [repeatTrying, setRepeatTrying] = useState(0);
  const flipRef = useRef<{ triggerFlip: () => boolean }>(null);

  // Create a public client to interact with the blockchain
  const publicClient = createPublicClient({
    chain: abstractTestnet,
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

  // Check approved amount for the contract
  const { data: approvedAmount, refetch: refetchApprovedAmount } = useReadContract({
    address: contractAddress,
    abi: koalaKoinTossV1Abi,
    functionName: 'allowance',
    args: [address, contractAddress],
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'allowance',
    args: [address || '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', contractAddress],
  });

  useEffect(() => {
    console.log('allowance', address, allowance);
  }, [allowance]);

  useEffect(() => {
    if (address) {
      console.log('refetching allowance', address);
      refetchAllowance();
    }
  }, [address, refetchAllowance]);

  useEffect(() => {
    if (approvedAmount) {
      console.log('Approved amount:', approvedAmount);
    }
  }, [approvedAmount]);

  // Refetch approved amount when address changes
  useEffect(() => {
    if (address) {
      refetchApprovedAmount();
    }
  }, [address, refetchApprovedAmount]);

  const { data: client, isLoading, error: txError } = useGlobalWalletSignerClient();

  // const {
  //   sendTransaction,
  //   data: transactionHash,
  //   error,
  // } = useSendTransaction({
  //   mutation: {
  //     onError: (error: any) => {
  //       console.error('Transaction error:', error);
  //       setIsFlipping(false);
  //       refetchWalletBalance();
  //     },
  //   },
  // });

  // const {
  //   writeContractSponsored,
  //   data: transactionHash,
  //   error: txError,
  // } = useWriteContractSponsored();

  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();

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

    // Create a public client to interact with the blockchain
    // const publicClient = createPublicClient({
    //   chain: abstractTestnet,
    //   transport: http(),
    // });

    // Encode the function call data
    const data = encodeFunctionData({
      abi: koalaKoinTossV1Abi,
      functionName: 'bet_eth',
      args: [gameNumber],
    });

    const sendValue = parseEther(betAmount.toString());

    const result = await client?.sendTransaction({
      value: sendValue,
      to: contractAddress,
      data: data,
      account: address,
      chainId: abstractTestnet.id,
    });

    setTransactionHash(result);

    // sendTransaction({
    //   value: sendValue,
    //   to: contractAddress,
    //   data: data,
    //   account: address,
    //   chainId: abstractTestnet.id,
    // });

    // writeContractSponsored({
    //   abi: koalaKoinTossV1Abi,
    //   address: contractAddress,
    //   functionName: 'bet_eth',
    //   args: [0],
    //   paymaster: '0x5407B5040dec3D339A9247f3654E59EEccbb6391',
    //   paymasterInput: getGeneralPaymasterInput({
    //     innerInput: '0x',
    //   }),
    //   authorizationList: [],
    // });
  };

  const checkResult = (transactionReceipt: any, selectedSide: 'HEADS' | 'TAILS') => {
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

    setIsWinning(gameResult.won);
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

  // useEffect(() => {
  //   if (autoFlip && autoFlipCount > 0 && repeatTrying > 0) {
  //     if (repeatTrying == 1) {
  //       if (autoFlipCount == 1) {
  //         setAutoFlip(false);
  //       } else {
  //         setAutoFlipCount(autoFlipCount - 1);
  //       }
  //     }

  //     setTimeout(() => {
  //       console.log('restart!!!', repeatTrying);
  //       flipRef.current?.triggerFlip();
  //     }, 1000);
  //   }
  // }, [repeatTrying]);

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
      switch (true) {
        case coinCount === 1 && minHeads === 1:
          setGameNumber(0);
          break;
        case coinCount === 2 && minHeads === 2:
          setGameNumber(1);
          break;
        default:
          setGameNumber(-1);
          console.log('no game available');
      }
    }
  }, [coinCount, minHeads]);

  useEffect(() => {
    refetchGameOptions();
  }, [gameNumber]);

  useEffect(() => {
    if (gameOptions) {
      console.log('gameOptions', gameOptions);

      const winChance: bigint = (gameOptions as any)[4];
      setWinningProbability(Number(winChance) / 100_000_000);

      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: 'getPayout',
          args: [gameNumber, parseEther(betAmount.toString())],
        })
        .then((r) => {
          console.log('r', r);
          setPayout(Number((r as any)[2]));
        });
    }
  }, [gameOptions]);

  useEffect(() => {
    if (!betAmount) {
      setBetAmount(0);
    }

    if (balance < betAmount) {
      setBetAmount(balance);
    }

    if (winningProbability > 0) {
      publicClient
        .readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: 'getPayout',
          args: [gameNumber, parseEther(betAmount.toString())],
        })
        .then((r) => {
          console.log('r', r);
          setPayout(Number((r as any)[2]));
        });
    }
  }, [betAmount, balance]);

  useEffect(() => {
    if (payout) {
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
          ref={flipRef}
        />

        <div className="flex justify-end pr-10">
          <div className="text-[9px] text-white flex items-center">ANIMATION</div>
          <img
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
