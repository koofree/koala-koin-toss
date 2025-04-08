import { Image } from '@/components/image/image';

export const EthereumIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/images/ethereum-svgrepo-com.svg"
      alt="ETH"
      width={16}
      height={16}
      className={className}
    />
  );
};

export default EthereumIcon;
