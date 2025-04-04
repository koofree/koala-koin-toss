import { Image } from '@/components/image/image';

interface SideLayoutProps {
  side: 'left' | 'right';
}

export const SideLayout = ({ side }: SideLayoutProps) => {
  return (
    <div className="hidden 2xl:flex flex-col justify-center items-center w-full h-full relative">
      <div className="h-[20vh]">&nbsp;</div>
      <Image
        src={
          side === 'left'
            ? '/images/koala/dancing/dancing_koala_front.gif'
            : '/images/koala/dancing/dancing_koala_back.gif'
        }
        alt="Dancing Koala"
        width={0}
        className="max-w-48 min-w-0"
        unoptimized
      />
      <div className="flex flex-row justify-center items-end space-x-2 w-full absolute bottom-0">
        <Image src="/images/footer/ic_cactus1.png" alt="Cactus 1" />
        {side === 'left' && <Image src="/images/footer/ic_cactus2.png" alt="Cactus 2" />}
        {side === 'right' && <Image src="/images/footer/ic_cactus4.png" alt="Cactus 4" />}
      </div>
    </div>
  );
};
