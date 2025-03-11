import GameWrapper from './components/GameWrapper';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-[1024px] h-[768px]">
        <h1 className="text-4xl font-bold mb-4 text-center">Firma Flip</h1>
        <GameWrapper />
      </div>
    </main>
  );
}
