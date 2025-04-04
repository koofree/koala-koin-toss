import Link from 'next/link';

import { Image } from '@/components/image/image';
import { UserPanel } from '@/components/UserPanel';
import { Address, UserStatus, WalletBalance } from '@/types';

interface HeaderLayoutProps {
  address?: Address;
  walletBalance?: WalletBalance;
  kpBalance?: WalletBalance;
  login: () => void;
  logout: () => void;
  status: UserStatus;
}

export const HeaderLayout = ({
  address,
  walletBalance,
  kpBalance,
  login,
  logout,
  status,
}: HeaderLayoutProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex justify-center ml-10 mt-8">
        <Link href="/">
          <Image
            src="/images/header/lg_koala_koin-toss_original.png"
            alt="Dancing Koala"
            width={126}
          />
        </Link>
      </div>
      <UserPanel
        address={address}
        walletBalance={walletBalance}
        kpBalance={kpBalance}
        login={login}
        logout={logout}
        status={status}
      />
    </div>
  );
};
