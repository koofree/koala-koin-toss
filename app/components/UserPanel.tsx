'use client';

import { useBalance } from '@/hooks/useBalance';
import { roundNumber } from '@/utils/floorNumber';
import { formatAddress } from '@/utils/format';
import { useLoginWithAbstract } from '@abstract-foundation/agw-react';
import { useAccount } from 'wagmi';
import { PanelButton } from './buttons/PanelButton';
import { Image } from './image/image';

interface UserPanelProps {}

export const UserPanel = ({}: UserPanelProps) => {
  const { login, logout } = useLoginWithAbstract();
  const { address, status } = useAccount();
  const { ethBalance, tokenBalance } = useBalance();

  // const moveToExplorer = () => {
  // window.open(`${clientConfig.chain.blockExplorers.default.url}/address/${address}`, '_blank');
  // };

  return (
    <div className="mr-10 mt-8">
      {status === 'connected' ? (
        <div
          className=" 
            flex flex-row justify-center items-center space-x-3
            h-[48px]
            rounded-full 
            bg-white/15 
            p-3 px-3
            backdrop-blur-sm
          "
        >
          <div className="flex flex-row items-center">
            <Image
              src="/images/ethereum-svgrepo-com.svg"
              alt="ETH"
              width={16}
              height={16}
              className="my-auto inline mr-[3px]"
            />
            <span className="text-white">
              {roundNumber(ethBalance.formatted)} {ethBalance.symbol}
            </span>
          </div>
          <div className="my-auto ">
            <div className="h-4 w-[1px] bg-white/30" about="bar"></div>
          </div>
          <div className="flex flex-row items-center">
            <Image
              src="/images/koala/ic_kp_small.png"
              width={16}
              alt="1 TO WIN"
              className="my-auto inline mr-[5px]"
            />
            <span className="text-white">
              {roundNumber(tokenBalance.formatted, 2)} {tokenBalance.symbol}
            </span>
          </div>
          <div
            className="bg-black/40 rounded-full px-3 py-1 flex items-center h-[32px] 
            space-x-2
            font-extralight"
          >
            <Image
              src="/abs.svg"
              alt="Loading"
              width={16}
              height={16}
              className="opacity-50 my-auto inline cursor-pointer"
              onClick={logout}
            />
            <span className="text-white/50 font-thin cursor-pointer" onClick={logout}>
              {formatAddress(address)}
            </span>
            <Image
              style={{ zIndex: 10, position: 'relative' }}
              onClick={logout}
              src="/images/header/ic_log-out_20px.png"
              alt="Loading"
              width={16}
              height={16}
              className="opacity-50 my-auto inline cursor-pointer"
            />
          </div>
        </div>
      ) : status === 'reconnecting' || status === 'connecting' ? (
        <PanelButton onClick={login} textClassName="" className="w-[222px] h-[46px]">
          <div id="loading-spinner" className="animate-spin">
            <Image src="/abs.svg" alt="Loading" width={16} height={16} />
          </div>
        </PanelButton>
      ) : (
        <PanelButton onClick={login} textClassName="" className="w-[222px] h-[46px]">
          Sign in with Abstract
        </PanelButton>
      )}
    </div>
  );
};
