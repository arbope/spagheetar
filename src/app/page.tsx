import GuitarApp from './components/guitarApp';

export default function Home() {

  return (
    <div className="bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <GuitarApp />
      </div>
    </div>
  );
}