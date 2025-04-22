import Link from 'next/link';
import BouncingLogo from './components/BouncingLogo';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-plasma-dark text-white">

      <h1 className="text-4xl font-bold mb-6 text-plasma">STIBELKOIN QUIZ</h1>
      <p className="text-xl mb-8">Test your knowledge about Plasma! In this quiz, you need to determine whether the presented facts are true or false.</p>
      <div className="mb-6 z-100">
        <h2 className="text-2xl font-semibold mb-4 text-plasma">Rules:</h2>
        <ul className="text-left list-disc list-inside">
          <li className="mb-2">You have 7 seconds for each question</li>
          <li className="mb-2">Choose "True" or "False" for each fact</li>
          <li className="mb-2">At the end of the quiz, you'll see your result</li>
          <li className="mb-2 "><Link href="https://plasma.to" target="_blank" rel="noopener noreferrer" className="animate-pulse text-plasma z-1000" >Trillions</Link> 👈</li>
        </ul>
      </div>
      <Link href="/quiz" className="px-6 py-3 bg-plasma-light z-100 text-plasma-dark rounded-lg  hover:scale-101  text-lg transition-all font-medium">
        Start Quiz
      </Link>
      <BouncingLogo className="z-0"/>
      <div className="absolute bottom-4 text-sm text-plasma">
        <Link href="https://x.com/stepaks576" target="_blank" rel="noopener noreferrer" className="hover:text-plasma transition-colors">
          Made by Stepaks
        </Link>
      </div>
    </div>
    
  );
}
