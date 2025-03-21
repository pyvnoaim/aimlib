import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center items-center py-4 z-50">
      <nav className="flex space-x-8 bg-white/3 backdrop-blur-sm rounded-lg px-8 py-3 shadow-sm outline-1">
        <Link
          href="/"
          className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 font-bold text-sm px-4 py-2"
        >
          Home
        </Link>
        <Link
          href="/playlists"
          className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 font-bold text-sm px-4 py-2"
        >
          Playlists
        </Link>
        <Link
          href="/themes"
          className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 font-bold text-sm px-4 py-2"
        >
          Themes
        </Link>
        <Link
          href="/sounds"
          className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 font-bold text-sm px-4 py-2"
        >
          Sounds
        </Link>
        <Link
          href="/crosshairs"
          className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 font-bold text-sm px-4 py-2"
        >
          Crosshairs
        </Link>
      </nav>
    </header>
  );
};

export default Header;
