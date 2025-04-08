import { useUserGameOptionStore } from '@/store/useUserGameOptionStore';
import { Image } from '../image/image';

interface TitlePanelProps {
  winningProbability: number;
  onClick: () => void;
  isHistoryOpen: boolean;
}

export const TitlePanel = ({ winningProbability, onClick, isHistoryOpen }: TitlePanelProps) => {
  const { userGameOption } = useUserGameOptionStore();
  const { coinCount, minHeads, selectedSide } = userGameOption;

  if (isHistoryOpen) {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-center 
          w-[319px] h-[75px]
          bg-[url('/images/middle/img_title-bar_2-1.png')] bg-cover bg-center bg-no-repeat
          before:content-[''] before:absolute before:left-[-32px] before:top-0 before:w-[33px] before:h-[75px]
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-32px] after:top-0 after:w-[33px] after:h-[75px]
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
      >
        <div className="flex items-center gap-6">
          <div className="flex justify-center items-center gap-4">
            <Image src="/images/replaces/ic_trophy_28px.png" width={24} alt="1 TO WIN" />
            <label
              htmlFor="Win History"
              className="text-white text-2xl cursor-pointer font-semibold"
            >
              WIN HISTORY
            </label>
            <Image src="/images/replaces/ic_trophy_28px.png" width={24} alt="1 TO WIN" />
          </div>
        </div>
      </div>
    );
  }

  return coinCount === 1 || minHeads === coinCount ? (
    <div
      onClick={onClick}
      className="flex items-center justify-center 
          w-[319px] h-[75px]
          bg-[url('/images/middle/img_title-bar_2-1.png')] bg-cover bg-center bg-no-repeat
          before:content-[''] before:absolute before:left-[-32px] before:top-0 before:w-[33px] before:h-[75px]
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-32px] after:top-0 after:w-[33px] after:h-[75px]
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Image
            src={
              selectedSide === 'HEADS'
                ? '/images/middle/coins/ic_koa_20px.png'
                : '/images/middle/coins/ic_koa_back_24px.png'
            }
            width={24}
            alt="1 TO WIN"
          />
          <label htmlFor="1-to-win" className="text-white text-2xl cursor-pointer font-semibold">
            {minHeads} TO WIN
          </label>
        </div>
        <label htmlFor="50% CHANCE" className="text-gray-400 text-lg cursor-pointer">
          {winningProbability}% CHANCE
        </label>
      </div>
    </div>
  ) : (
    <div
      onClick={onClick}
      className="flex items-center justify-center 
          w-[437px] h-[75px]
          bg-[url('/images/middle/img_title-bar_2-2.png')] bg-cover bg-center bg-no-repeat
          before:content-[''] before:absolute before:left-[-32px] before:top-0 before:w-[33px] before:h-[75px]
          before:bg-[url('/images/middle/img_title-bar_1.png')] before:bg-cover before:bg-center before:bg-no-repeat
          after:content-[''] after:absolute after:right-[-32px] after:top-0 after:w-[33px] after:h-[75px]
          after:bg-[url('/images/middle/img_title-bar_3.png')] after:bg-cover after:bg-center after:bg-no-repeat
          relative
          cursor-pointer
          "
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Image
            src={
              selectedSide === 'HEADS'
                ? '/images/middle/coins/ic_koa_20px.png'
                : '/images/middle/coins/ic_koa_back_24px.png'
            }
            width={24}
            alt="1 TO WIN"
          />
          <label htmlFor="1-to-win" className="text-white text-2xl cursor-pointer font-semibold">
            {minHeads} {minHeads === coinCount ? '' : 'OR MORE'} TO WIN
          </label>
        </div>
        <label htmlFor="50% CHANCE" className="text-gray-400 text-lg cursor-pointer">
          {winningProbability}% CHANCE
        </label>
      </div>
    </div>
  );
};
