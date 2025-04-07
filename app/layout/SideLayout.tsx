import { Image } from '@/components/image/image';

interface SideLayoutProps {
  side: 'left' | 'right';
}

export const SideLayout = ({ side }: SideLayoutProps) => {
  return (
    <div
      className={`
        flex flex-col h-full min-w-[320px]
        absolute 
        ${side === 'left' ? 'left-0' : 'right-0'}
        z-0
      `}
    >
      <div className="h-[35vh] min-h-[300px]">&nbsp;</div>
      <div className="flex flex-row justify-center min-h-[600px] pt-40">
        <Image
          src={
            side === 'left'
              ? '/images/koala/dancing/dancing_koala_front.gif'
              : '/images/koala/dancing/dancing_koala_back.gif'
          }
          alt="Dancing Koala"
          width={200}
          height={200}
          unoptimized
        />
      </div>
      <div className="flex flex-row justify-center items-end space-x-2 w-full absolute bottom-0">
        <div className="flex flex-col items-start">
          {side === 'left' && (
            <Image src="/images/gif/spark.gif" alt="Cactus 2" width={20} height={20} />
          )}
          <Image
            src="/images/gif/torch.gif"
            alt="Torch"
            width={48}
            className="max-w-48 min-w-0"
            unoptimized
          />
        </div>

        <Image src="/images/footer/ic_cactus1.png" alt="Cactus 1" />
        {side === 'left' && <Image src="/images/footer/ic_cactus2.png" alt="Cactus 2" />}
        {side === 'right' && <Image src="/images/footer/ic_cactus4.png" alt="Cactus 4" />}
        <div className="flex flex-col items-end">
          {side === 'right' && (
            <Image src="/images/gif/spark.gif" width={20} alt="Cactus 2" className="right-0" />
          )}
          <Image
            src="/images/gif/torch.gif"
            alt="Torch"
            width={48}
            className="max-w-48 min-w-0"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};
