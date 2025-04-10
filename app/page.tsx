'use client';

import { Stars } from './components/image/Stars';
import { MainGame } from './components/MainGame';
import { FooterLayout } from './layout/FooterLayout';
import { HeaderLayout } from './layout/HeaderLayout';
import { SideLayout } from './layout/SideLayout';

export default function Home() {
  return (
    <main
      className="
        flex flex-col justify-between items-center
        w-full h-dvh min-w-[1280px] min-h-[1088px]
        bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat 
        relative
      "
    >
      <div className="flex flex-col max-w-[1920px] min-h-[1000px] w-full h-full">
        <HeaderLayout />
        <div className="flex flex-row justify-center w-full h-full relative">
          <SideLayout side="left" />
          <SideLayout side="right" />
          <MainGame />
        </div>
      </div>
      <FooterLayout />
      <Stars />
    </main>
  );
}
