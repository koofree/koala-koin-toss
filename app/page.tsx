'use client';

import { MainGame } from './components/MainGame';

export default function Home() {
  return (
    <main className="flex flex-col items-center relative">
      <div className="w-[1024px] h-[512px] bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="w-full flex flex-row items-center">
          <div className="w-2/12 h-full flex flex-col items-center justify-center">
            <img
              src="/images/koala/dancing/dancing_koala_front.gif"
              alt="Dancing Koala"
              className="w-2/3 mt-[250px]"
            />
            <div className="flex flex-col items-center justify-center absolute bottom-0">
              <div className="flex space-x-2">
                <img src="/images/footer/ic_cactus1.png" alt="Cactus 1" className="w-6 h-6" />
                <img src="/images/footer/ic_cactus2.png" alt="Cactus 2" className="w-6 h-6" />
                <img src="/images/footer/ic_cactus4.png" alt="Cactus 4" className="w-6 h-6" />
              </div>
            </div>
          </div>
          <MainGame />
          <div className="w-2/12 h-full flex flex-col items-center justify-center">
            <img
              src="/images/koala/dancing/dancing_koala_back.gif"
              alt="Dancing Koala"
              className="w-2/3 mt-[250px]"
            />
            <div className="flex flex-col items-center justify-center absolute bottom-0">
              <div className="flex space-x-2">
                <img src="/images/footer/ic_cactus1.png" alt="Cactus 1" className="w-6 h-6" />
                <img src="/images/footer/ic_cactus2.png" alt="Cactus 2" className="w-6 h-6" />
                <img src="/images/footer/ic_cactus4.png" alt="Cactus 4" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
