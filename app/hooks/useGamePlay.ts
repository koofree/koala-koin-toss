import {
  clientConfig,
  contractAddress,
  environment,
  functionNames,
  INITIAL_BET_AMOUNT,
  koalaKoinTossV1Abi,
  paymasterAddress,
} from '@/config';
import useSettingStore from '@/store/useSettingStore';
import { useUserGameOptionStore } from '@/store/useUserGameOptionStore';
import { GameOption } from '@/types';
import { clearStoredSession } from '@/utils/clearStoredSession';
import { createAndStoreSession } from '@/utils/createAndStoreSession';
import { roundNumber } from '@/utils/floorNumber';
import { generateResult } from '@/utils/generators';
import { getErc20Transfer } from '@/utils/getLogs';
import { getStoredSession } from '@/utils/getStoredSession';
import { useAbstractClient, useCreateSession } from '@abstract-foundation/agw-react';
import { useEffect, useState } from 'react';
import { Address, formatUnits, parseEther, PublicClient, TransactionReceipt } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getGeneralPaymasterInput } from 'viem/zksync';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useBalance } from './useBalance';
import { useGameHistory } from './useGameHistory';

type GamePlayProps = {
  publicClient: PublicClient;
  userAddress?: Address;
};

export const useGamePlay = ({ userAddress, publicClient }: GamePlayProps) => {
  const { myGameHistory } = useGameHistory(userAddress);
  const { ethBalance, refetch } = useBalance();
  const { soundEnabled } = useSettingStore();

  const [isWin, setIsWin] = useState<boolean | null>(null);
  const { gameId, userGameOption, setOption, setBetAmount, setSelectedSide } =
    useUserGameOptionStore();
  const [payout, setPayout] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);
  const [winningProbability, setWinningProbability] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const [results, setResults] = useState<Array<'HEADS' | 'TAILS' | null>>([null]);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const [txError, setTxError] = useState<Error | undefined>(undefined);

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

    if (soundEnabled) {
      new Audio('/sounds/coin-donation-2-180438.mp3').play();
    }

    const sessionData = await getStoredSession(userAddress, abstractClient);
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
      setReward(roundNumber(gameResult.reward));
    } else {
      const receipt: TransactionReceipt = (await publicClient.getTransactionReceipt({
        hash: gameResult.revealTransactionHash,
      })) as TransactionReceipt;

      const reward: number | undefined =
        receipt && userAddress ? await getErc20Transfer(receipt, userAddress) : undefined;

      setReward(reward ? roundNumber(reward) : 0);
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

  const initGamePlay = () => {
    setOption({ coinCount: 1, minHeads: 1 });
    setBetAmount(INITIAL_BET_AMOUNT);
    setSelectedSide('HEADS');
  };

  // When game option is changed
  useEffect(() => {
    applyGameOption(userGameOption.option);
    setDisabled(userGameOption.option === undefined);

    // Initialize the win state
    setIsWin(null);
    setReward(0);
  }, [gameId]);

  // When coin count or min heads is changed, reset the results to update coin display.
  useEffect(() => {
    setResults([null]);
  }, [userGameOption.coinCount, userGameOption.minHeads]);

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

      refetch();
      setIsFlipping(false);
    }
  }, [txError]);

  const interruptGamePlay = () => {
    setIsFlipping(false);
    refetch();
  };

  return {
    isFlipping,
    results,
    isWin,
    reward,
    winningProbability,
    payout,
    disabled,
    handleFlip,
    initGamePlay,
    interruptGamePlay,
  };
};
