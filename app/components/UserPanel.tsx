'use client';

import { useLoginWithAbstract, useWriteContractSponsored } from '@abstract-foundation/agw-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPublicClient, formatUnits, http, parseAbi } from 'viem';
import { abstractTestnet } from 'viem/chains';
import { getGeneralPaymasterInput } from 'viem/zksync';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';

export const UserPanel = () => {
  const { login, logout } = useLoginWithAbstract();
  const { address, status } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const { writeContractSponsored, data: transactionHash } = useWriteContractSponsored();
  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });
  const { data: balance } = useBalance({
    address: address,
  });

  // Create a public client to interact with the blockchain
  const publicClient = createPublicClient({
    chain: abstractTestnet,
    transport: http(),
  });

  // State to store events
  const [events, setEvents] = useState<any[]>([]);

  // Function to fetch events from contract
  const fetchContractEvents = async () => {
    if (!address) return;

    try {
      // Import KoalaKoinTossV1 ABI from the JSON file
      const koalaKoinTossV1Abi = await import('../../public/abis/KoalaKoinTossV1.json').then(
        (module) => module.default.abi
      );

      // Replace with your actual contract address
      const contractAddress = '0x14444806071625C010f01D5240d379C6247e7428';

      const blockNumber = await publicClient.getBlockNumber();

      // Fetch events
      const logs = await publicClient.getLogs({
        address: contractAddress,
        fromBlock: blockNumber - BigInt(1000),
        toBlock: blockNumber,
        events: koalaKoinTossV1Abi.filter((v) => v.type === 'event'), // filtering type is event
      });

      setEvents(logs);
      console.log('Contract events:', logs);
    } catch (error) {
      console.error('Error fetching contract events:', error);
    }
  };

  // Fetch events when component mounts or address changes
  useEffect(() => {
    if (address) {
      fetchContractEvents();
    }
  }, [address]);

  const formattedBalance = balance
    ? `${formatUnits(balance.value, balance.decimals)} ${balance.symbol}`
    : '0 ETH';

  return (
    <>
      {status === 'connected' ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-lg backdrop-blur-sm w-full max-w-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                Connected to Abstract Global Wallet
              </p>
              <p className="text-xs text-gray-400 font-mono break-all">{address}</p>
              <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                <a
                  href={`https://explorer.testnet.abs.xyz/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Explorer (Balance: {formattedBalance})
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center bg-gray-800 text-white gap-2 hover:bg-white/20 text-sm h-10 px-5 font-[family-name:var(--font-roobert)] w-full sm:flex-1"
                onClick={logout}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Disconnect
              </button>
              <button
                className={`rounded-full border border-solid transition-colors flex items-center justify-center text-white gap-2 text-sm h-10 px-5 font-[family-name:var(--font-roobert)] w-full sm:flex-1
                        ${
                          !sendTransaction || isPending || transactionReceipt?.status === 'success'
                            ? 'bg-gray-500 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 border-transparent'
                        }`}
                onClick={() =>
                  writeContractSponsored({
                    abi: parseAbi(['function mint(address,uint256) external']),
                    address: '0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA',
                    functionName: 'mint',
                    args: [address, BigInt(1)],
                    paymaster: '0x5407B5040dec3D339A9247f3654E59EEccbb6391',
                    paymasterInput: getGeneralPaymasterInput({
                      innerInput: '0x',
                    }),
                  })
                }
                disabled={
                  !writeContractSponsored || isPending || transactionReceipt?.status === 'success'
                }
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="w-full text-center">
                  {!transactionReceipt
                    ? 'Submit tx'
                    : transactionReceipt.status === 'success'
                      ? 'Success'
                      : 'Failed'}
                </span>
              </button>
            </div>
            {!!transactionReceipt && (
              <a
                href={`https://explorer.testnet.abs.xyz/tx/${transactionReceipt?.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-sm sm:text-base font-medium font-[family-name:var(--font-roobert)] mb-1">
                  Transaction Status: {transactionReceipt?.status}
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {transactionReceipt?.transactionHash?.slice(0, 8)}...
                  {transactionReceipt?.transactionHash?.slice(-6)}
                </p>
              </a>
            )}
          </div>
        </div>
      ) : status === 'reconnecting' || status === 'connecting' ? (
        <div id="loading-spinner-container" className="flex items-center justify-center w-10 h-10">
          <div id="loading-spinner" className="animate-spin">
            <Image src="/abs.svg" alt="Loading" width={24} height={24} />
          </div>
        </div>
      ) : (
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white dark:hover:bg-[#e0e0e0] dark:hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 font-[family-name:var(--font-roobert)]"
          onClick={login}
        >
          <Image
            className="dark:invert"
            src="/abs.svg"
            alt="Abstract logomark"
            width={20}
            height={20}
            style={{ filter: 'brightness(0)' }}
          />
          Sign in with Abstract
        </button>
      )}
    </>
  );
};
