'use client';
import Footer from '@/components/footer';
import Background from '@/components/background';

export default function Playlists() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />

      <div className="flex-grow h-screen flex flex-col z-10 relative">
        <header className="pt-8">
          <div className="text-center">
            <h1 className="font-extrabold text-5xl md:text-6xl text-white">
              PLAYLISTS
            </h1>
          </div>
        </header>

        <main className="flex-grow flex flex-col transition-all duration-300 p-8">
          <section className="bg-zinc-800 p-4 h-full rounded-lg shadow-lg border border-zinc-700">
            <table className="w-full overflow-auto">
              <thead>
                <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800/50 backdrop-blur-sm">
                  <th className="p-2 text-left">Play</th>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Author</th>
                  <th className="p-2 text-center">Likes</th>
                  <th className="p-2 text-center">Aimtrainer</th>
                  <th className="p-2 text-center">Playtime</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
            </table>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
