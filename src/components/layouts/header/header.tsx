import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center items-center py-4 z-50">
      <nav className="flex space-x-8 bg-white/30 backdrop-blur-sm rounded-lg px-8 py-3 shadow-sm">
        <Link
          href="/"
          className="text-white hover:text-purple-400 transition duration-300 font-medium"
        >
          Home
        </Link>
        <Link
          href="/playlists"
          className="text-white hover:text-purple-400 transition duration-300 font-medium"
        >
          Playlists
        </Link>
        <Link
          href="/themes"
          className="text-white hover:text-purple-400 transition duration-300 font-medium"
        >
          Themes
        </Link>
        <Link
          href="/sounds"
          className="text-white hover:text-purple-400 transition duration-300 font-medium"
        >
          Sounds
        </Link>
        <Link
          href="/crosshairs"
          className="text-white hover:text-purple-400 transition duration-300 font-medium"
        >
          Crosshairs
        </Link>
      </nav>
    </header>
  );
};

export default Header;
