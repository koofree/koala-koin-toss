import { Image } from '../image/image';

interface TitlePanelProps {
  selectedSide: 'HEADS' | 'TAILS' | null;
  coinCount: number;
  minHeads: number;
  winningProbability: number;
  onClick: () => void;
  isHistoryOpen: boolean;
}

export const TitlePanel = ({
  coinCount,
  minHeads,
  winningProbability,
  onClick,
  isHistoryOpen,
}: TitlePanelProps) => {
  if (isHistoryOpen) {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-center 
          mx-auto
          bg-[url('/images/middle/img_title-bar_2-1.png')] 
          bg-cover bg-center bg-no-repeat h-10 w-40
          before:content-[''] before:absolute before:left-[-16px] before:top-0 before:w-4 before:h-10
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-16px] after:top-0 after:w-4 after:h-10
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
      >
        <div className="flex items-center gap-2">
          <Image src="/images/middle/ic_trophy_28px.png" width={12} alt="1 TO WIN" />
          <label htmlFor="Win History" className="text-white text-xs cursor-pointer">
            WIN HISTORY
          </label>
          <Image src="/images/middle/ic_trophy_28px.png" width={12} alt="1 TO WIN" />
        </div>
      </div>
    );
  }

  return coinCount === 1 || minHeads === coinCount ? (
    <div
      onClick={onClick}
      className="flex items-center justify-center 
          mx-auto
          bg-[url('/images/middle/img_title-bar_2-1.png')] 
          bg-cover bg-center bg-no-repeat h-10 w-40
          before:content-[''] before:absolute before:left-[-16px] before:top-0 before:w-4 before:h-10
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-16px] after:top-0 after:w-4 after:h-10
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
    >
      <div className="flex items-center gap-2">
        <Image src="/images/middle/coins/ic_koa_20px.png" width={12} alt="1 TO WIN" />
        <label htmlFor="1-to-win" className="text-white text-xs cursor-pointer">
          {minHeads} TO WIN
        </label>
        <label htmlFor="50% CHANCE" className="text-gray-400 text-[9px] cursor-pointer">
          {winningProbability}% CHANCE
        </label>
      </div>
    </div>
  ) : (
    <div
      onClick={onClick}
      className="flex items-center justify-center 
          mx-auto
          bg-[url('/images/middle/img_title-bar_2-2.png')] 
          bg-cover bg-center bg-no-repeat h-10 w-[220px]
          before:content-[''] before:absolute before:left-[-16px] before:top-0 before:w-4 before:h-10
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-16px] after:top-0 after:w-4 after:h-10
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
    >
      <div className="flex items-center gap-2">
        <Image src="/images/middle/coins/ic_koa_20px.png" width={12} alt="1 TO WIN" />
        <label htmlFor="1-to-win" className="text-white text-xs cursor-pointer">
          {minHeads} {minHeads === coinCount ? '' : 'OR MORE'} TO WIN
        </label>
        <label htmlFor="50% CHANCE" className="text-gray-400 text-[9px] cursor-pointer">
          {winningProbability}% CHANCE
        </label>
      </div>
    </div>
  );
};
