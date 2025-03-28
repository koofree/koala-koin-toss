import { useEffect, useState } from 'react';
import { createPublicClient, encodeFunctionData, formatUnits, http, parseEther } from 'viem';
import { abstractTestnet } from 'viem/chains';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ActionButtons } from './ActionButtons';
import { CoinDisplay } from './CoinDisplay';

// Calculate probability of getting k or more successes in n trials
const calculateProbability = (n: number, k: number, max: number) => {
  // Calculate binomial probability: P(X = k) = (n choose k) * p^k * (1-p)^(n-k)
  const binomialCoefficient = (n: number, k: number) => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= n - (i - 1);
      result /= i;
    }
    return result;
  };

  // Sum probabilities from k to max
  let probability = 0;
  for (let i = k; i <= max; i++) {
    probability += binomialCoefficient(n, i) * Math.pow(0.5, n);
  }

  return probability;
};

const caculateReward = (betAmount: number, probability: number) => {
  return parseFloat((betAmount / probability).toFixed(2));
};

const toBalance = (walletBalance?: { value: bigint; decimals: number }) => {
  return parseFloat(walletBalance ? formatUnits(walletBalance.value, walletBalance.decimals) : '0');
};

export const MainGame = () => {
  const { address, status } = useAccount();
  const { data: walletBalance, refetch } = useBalance({
    address: address,
  });

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

  const {
    sendTransaction,
    isPending,
    data: transactionHash,
    error: txError,
  } = useSendTransaction();

  // const {
  //   writeContractSponsored,
  //   data: transactionHash,
  //   error: txError,
  // } = useWriteContractSponsored();

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
    if (!selectedSide || isFlipping || balance < betAmount) return;

    setIsFlipping(true);

    // Create a public client to interact with the blockchain
    const publicClient = createPublicClient({
      chain: abstractTestnet,
      transport: http(),
    });

    // Import KoalaKoinTossV1 ABI from the JSON file
    const koalaKoinTossV1Abi = await import('../../public/abis/KoalaKoinTossV1.json').then(
      (module) => module.default.abi
    );

    // Replace with your actual contract address
    const contractAddress = '0x14444806071625C010f01D5240d379C6247e7428';

    // Encode the function call data
    const data = encodeFunctionData({
      abi: koalaKoinTossV1Abi,
      functionName: 'bet_eth',
      args: [0],
    });

    const sendValue = parseEther(betAmount.toString());

    sendTransaction({
      value: sendValue,
      to: contractAddress,
      data: data,
      account: address,
      chainId: abstractTestnet.id,
      gas: BigInt(10000000),
    });

    console.log('sendValue', sendValue);

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

  useEffect(() => {
    if (transactionHash) {
      console.log('transactionHash', transactionHash);
    }
  }, [transactionHash]);

  useEffect(() => {
    if (transactionReceipt) {
      // Generate results for all coins
      const newResults = Array(coinCount)
        .fill(0)
        .map(() => (Math.random() < 0.5 ? 'HEADS' : 'TAILS'));

      // Count heads
      const headsCount = newResults.filter((result) => result === 'HEADS').length;

      // Win condition based on selected side and heads count
      const won =
        selectedSide === 'HEADS' ? headsCount >= minHeads : headsCount <= coinCount - minHeads;

      // Calculate reward based on probability
      let reward = betAmount;
      if (won) {
        // Calculate probability of winning based on the selected side
        const probability =
          selectedSide === 'HEADS'
            ? calculateProbability(coinCount, minHeads, coinCount) // P(heads >= minHeads)
            : calculateProbability(coinCount, 0, coinCount - minHeads); // P(heads <= coinCount - minHeads)

        setWinningProbability(probability);
        // Higher reward for lower probability events
        reward = caculateReward(betAmount, probability);
      }

      console.log('transactionReceipt', transactionReceipt);

      setIsWinning(won);
      setResults(newResults);
      refetch();
      setIsFlipping(false);
    }
  }, [transactionReceipt]);

  useEffect(() => {
    if (txError) {
      console.error('txError', txError);

      setIsFlipping(false);
      refetch();
    }
  }, [txError]);

  useEffect(() => {
    if (selectedSide && coinCount && minHeads) {
      const probability =
        selectedSide === 'HEADS'
          ? calculateProbability(coinCount, minHeads, coinCount) // P(heads >= minHeads)
          : calculateProbability(coinCount, 0, coinCount - minHeads); // P(heads <= coinCount - minHeads)

      setWinningProbability(probability);
    }
  }, [selectedSide, coinCount, minHeads]);

  useEffect(() => {
    if (!betAmount) {
      setBetAmount(0);
    }

    if (balance < betAmount) {
      setBetAmount(balance);
    }

    if (winningProbability > 0) {
      const reward = caculateReward(betAmount, winningProbability);
      setExpectedValue(reward);
    }
  }, [betAmount, balance, winningProbability]);

  useEffect(() => {
    setBalance(toBalance(walletBalance));
  }, [walletBalance]);

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
