export const FooterLayout = () => {
  return (
    <div
      className="
        flex flex-row justify-center
        w-full h-[88px] min-h-[88px] 
        min-w-[1024px]
        bg-gradient-to-b from-[#433555] via-[#322346] to-[#251639]"
    >
      <div
        className="
        flex flex-row justify-between items-center
        w-full h-full max-w-[1920px] px-10
        "
      >
        <div
          className="flex flex-col space-y-1 
            2xl:flex-row 
            2xl:space-x-2 
            2xl:space-y-0
            items-end
            text-white/70 text-xs"
        >
          <span className="font-['Press_Start_2P']">© 2025 Koala Koin Toss</span>
          <span className="hidden 2xl:inline text-white/20 font-['Press_Start_2P']">|</span>
          <span className="font-['Press_Start_2P']">All rights reserved.</span>
        </div>
        <div
          className="flex-col space-y-1
            2xl:flex-row 
            2xl:space-x-2
            2xl:space-y-0
            items-end
            text-white/70 text-xs flex "
        >
          <span className="font-['Press_Start_2P']">
            Fair randomness powered with Proof of Play
          </span>
          <span className="hidden 2xl:inline text-white/20 font-['Press_Start_2P']">|</span>
          <span className="font-['Press_Start_2P']">Documentation</span>
          <span className="hidden 2xl:inline text-white/20 font-['Press_Start_2P']">|</span>
          <span className="font-['Press_Start_2P']">X (TWITTER)</span>
        </div>
      </div>
    </div>
  );
};

export default FooterLayout;
