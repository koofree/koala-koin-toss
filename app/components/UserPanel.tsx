'use client';

import { clientConfig } from '@/config';
import { floorNumber } from '@/utils/floorNumber';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { PanelButton } from './buttons/PanelButton';
import { Image } from './image/image';

const formatAddress = (address: `0x${string}` | undefined) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

interface UserPanelProps {
  login: () => void;
  logout: () => void;
  address?: `0x${string}`;
  walletBalance?: { value: bigint; decimals: number; symbol: string };
  kpBalance?: { value: bigint; decimals: number; symbol: string };
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}

export const UserPanel = ({
  login,
  logout,
  address,
  walletBalance,
  kpBalance,
  status,
}: UserPanelProps) => {
  const formattedBalance = walletBalance
    ? Number(formatUnits(walletBalance.value, walletBalance.decimals))
    : 0;
  const formattedKpBalance = kpBalance
    ? Number(formatUnits(kpBalance.value, kpBalance.decimals))
    : 0;

  useEffect(() => {
    if (status === 'connected') {
    }
  }, [status]);

  const moveToExplorer = () => {
    window.open(`${clientConfig.chain.blockExplorers.default.url}/address/${address}`, '_blank');
  };

  return (
    <div className="mt-[10px]">
      {status === 'connected' ? (
        <div
          className="absolute right-2 
            flex flex-row 
            h-7
            max-w-sm
            rounded-full 
            bg-white/15 
            pl-3 px-2 pb-1 
            shadow-lg 
            backdrop-blur-sm
          "
        >
          <div className="mr-[10px]">
            <Image
              src="/images/ethereum-svgrepo-com.svg"
              alt="ETH"
              width={10}
              height={10}
              className="my-auto inline mb-[-1px] mr-[3px]"
            />
            <span className="text-white text-[10px]">
              {floorNumber(formattedBalance)} {walletBalance?.symbol}
            </span>
          </div>
          <div className="my-auto pt-[3px]">
            <div className="h-3 w-[1px] bg-white/30 mr-[8px]" about="bar"></div>
          </div>
          <div className="mr-[10px]">
            <Image
              src="/images/middle/coins/ic_koa_20px.png"
              width={12}
              alt="1 TO WIN"
              className="my-auto inline mb-[-1px] mr-[5px]"
            />
            <span className="text-white text-[10px]">
              {floorNumber(formattedKpBalance, 2)} {kpBalance?.symbol}
            </span>
          </div>
          <div className="bg-black/40 rounded-full px-2 my-1 flex items-center h-5 font-extralight">
            <Image
              src="/abs.svg"
              alt="Loading"
              width={10}
              height={10}
              className="opacity-50 my-auto inline mr-[3px] cursor-pointer"
              onClick={moveToExplorer}
            />
            <span
              className="text-white/50 text-[9px] font-thin cursor-pointer"
              onClick={moveToExplorer}
            >
              {formatAddress(address)}
            </span>
            <Image
              style={{ zIndex: 10, position: 'relative' }}
              onClick={logout}
              src="/images/header/ic_log-out_20px.png"
              alt="Loading"
              width={12}
              height={12}
              className="opacity-50 my-auto inline cursor-pointer ml-[3px]"
            />
          </div>
        </div>
      ) : status === 'reconnecting' || status === 'connecting' ? (
        <PanelButton
          onClick={login}
          width={120}
          height={20}
          fontSize={9}
          className="absolute right-[10px]"
        >
          <div id="loading-spinner" className="animate-spin">
            <Image src="/abs.svg" alt="Loading" width={9} height={9} />
          </div>
        </PanelButton>
      ) : (
        <PanelButton
          onClick={login}
          width={120}
          height={20}
          fontSize={9}
          className="absolute right-[10px]"
        >
          Sign in with Abstract
        </PanelButton>
      )}
    </div>
  );
};
