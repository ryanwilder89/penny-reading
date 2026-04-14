import Link from 'next/link';

export default function PlacementFlow() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-3xl bg-white text-black p-8 md:p-12 rounded-xl shadow-xl flex flex-col gap-8 text-center">
        <h1 className="text-3xl font-bold">Initial Placement Check</h1>
        <p className="text-xl text-gray-600">Let's see what Penny already knows.</p>
        
        <div className="bg-gray-100 p-8 rounded-xl flex flex-col gap-4">
           <h2 className="text-2xl font-bold text-gray-700">Phase 1 Skills</h2>
           <p className="text-lg">Short vowels: a, e, i, o, u in CVC words.</p>
           
           <div className="text-5xl font-bold my-8">cat</div>
           
           <div className="flex gap-4 justify-center">
             <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow text-xl w-48">
               CORRECT
             </button>
             <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg shadow text-xl w-48">
               INCORRECT
             </button>
           </div>
        </div>

        <Link href="/" className="text-blue-500 font-semibold hover:underline mt-4 text-lg">
          Skip placement and go to Dashboard
        </Link>
      </div>
    </main>
  );
}
