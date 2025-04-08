import { kpAddress, kpSymbol } from '@/config';
import { useAccount, useBalance as wagmiUseBalance } from 'wagmi';

const formattedBalance = ({
  formatted,
  ...balance
}: {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}) => {
  return {
    ...balance,
    formatted: parseFloat(formatted),
  };
};

export const useBalance = (): {
  ethBalance: { formatted: number; symbol: string };
  tokenBalance: { formatted: number; symbol: string };
  refetch: () => void;
} => {
  const { address, status } = useAccount();

  const { data: ethBalance, refetch: refetchEthBalance } = wagmiUseBalance({
    address: address,
  });
  const { data: tokenBalance, refetch: refetchTokenBalance } = wagmiUseBalance({
    address: address,
    token: kpAddress,
  });

  const refetch = () => {
    refetchEthBalance();
    refetchTokenBalance();
  };

  return {
    ethBalance: ethBalance ? formattedBalance(ethBalance) : { formatted: 0, symbol: 'ETH' },
    tokenBalance: tokenBalance
      ? formattedBalance(tokenBalance)
      : { formatted: 0, symbol: kpSymbol },
    refetch,
  };
};
