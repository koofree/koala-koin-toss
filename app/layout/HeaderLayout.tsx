import Link from 'next/link';

import { Image } from '@/components/image/image';
import { UserPanel } from '@/components/UserPanel';

export const HeaderLayout = () => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex justify-center ml-10 mt-8">
        <Link href="/">
          <Image
            src="/images/replaces/lg_koala_koin-toss_original.png"
            alt="Dancing Koala"
            width={126}
            height={44}
          />
        </Link>
      </div>
      <UserPanel />
    </div>
  );
};
