'use client';
import { useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import {
  LuPlay,
  LuArrowDown,
  LuClipboard,
  LuClipboardCheck,
} from 'react-icons/lu';

const initialData = [
  {
    id: 1,
    name: 'KovaaKsSwitchingEntryWipe',
    author: 'minigodcs',
    game: 'KovaaKs',
    category: 'Clicking',
  },
  {
    id: 2,
    name: 'TacFPS Micro Corrections V2',
    author: 'minigodcs',
    game: 'Aimlabs',
    category: 'Clicking',
  },
  {
    id: 3,
    name: 'Playlist Name 3',
    author: 'Author 3',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 4,
    name: 'Playlist Name 4',
    author: 'Author 4',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 5,
    name: 'Playlist Name 5',
    author: 'Author 5',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 6,
    name: 'Playlist Name 6',
    author: 'Author 6',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 7,
    name: 'Playlist Name 7',
    author: 'Author 7',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 8,
    name: 'Playlist Name 8',
    author: 'Author 8',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 9,
    name: 'Playlist Name 9',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 10,
    name: 'Playlist Name 10',
    author: 'Author 10',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 11,
    name: 'Playlist Name 11',
    author: 'Author 11',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 12,
    name: 'Playlist Name 12',
    author: 'Author 12',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 13,
    name: 'Playlist Name 13',
    author: 'Author 13',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 14,
    name: 'Playlist Name 14',
    author: 'Author 14',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 15,
    name: 'Playlist Name 15',
    author: 'Author 15',
    game: 'Game 2',
    category: 'Category 2',
  },
  {
    id: 16,
    name: 'Playlist Name 16',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 17,
    name: 'Playlist Name 17',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 18,
    name: 'Playlist Name 18',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 19,
    name: 'Playlist Name 19',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
  {
    id: 20,
    name: 'Playlist Name 20',
    author: 'Author 9',
    game: 'Game 1',
    category: 'Category 1',
  },
];

const aimlabsPlaylistLinks: Record<string, string> = {
  'TacFPS Micro Corrections V2':
    'https://go.aimlab.gg/v1/redirects?link=aimlab%3a%2f%2fworkshop%3fid%3d2981067904%26source%3d973B8AF58E00033F&link=steam%3a%2f%2frungameid%2f714010', // Example of a playlist link
  'Aimlabs Playlist 2': 'aimlabs://playlist/2', // Another example
  // Add more playlists and their URLs here...
};

export default function Test() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [copySuccessMessage, setCopySuccessMessage] = useState('');
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGame(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleCopyTitle = (title: string) => {
    navigator.clipboard
      .writeText(title)
      .then(() => {
        setCopiedTitle(title);
        setCopySuccessMessage(`Playlist title "${title}" copied to clipboard!`);
        setTimeout(() => {
          setCopySuccessMessage('');
          setCopiedTitle(null);
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handlePlayClick = (playlistName: string, game: string) => {
    if (game === 'KovaaKs') {
      const steamUrl = `steam://run/824270/?action=jump-to-playlist;sharecode=${playlistName}`;
      window.location.href = steamUrl;
    } else if (game === 'Aimlabs') {
      const url = aimlabsPlaylistLinks[playlistName];
      if (url) {
        window.location.href = url;
      } else {
        alert('Playlist link not found for Aimlabs');
      }
    }
  };

  const filteredData = initialData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame ? item.game === selectedGame : true;
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesGame && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 p-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-1/3">
            <h1 className="font-extrabold text-3xl text-center sm:text-4xl md:text-5xl">
              PLAY:LISTS
            </h1>
          </div>

          <div className="mt-6 bg-zinc-900 p-8 rounded-lg shadow-lg space-y-6">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full h-10 px-4 py-2 rounded-md bg-zinc-700 text-white placeholder-gray-400 focus:outline-none text-sm mb-4"
              />

              <div className="flex items-center justify-between space-x-2">
                <div className="relative w-full">
                  <select
                    value={selectedGame}
                    onChange={handleGameChange}
                    className="w-full h-10 px-4 py-2 pl-3 pr-10 rounded-md bg-zinc-700 text-white focus:outline-none text-sm appearance-none"
                  >
                    <option value="">Select Game</option>
                    <option value="KovaaKs">KovaaKs</option>
                    <option value="Aimlabs">Aimlabs</option>
                  </select>
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white pointer-events-none">
                    <LuArrowDown className="w-5 h-5" />
                  </div>
                </div>

                <div className="relative w-full">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full h-10 px-4 py-2 pl-3 pr-10 rounded-md bg-zinc-700 text-white focus:outline-none text-sm appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Warmup">Warmup</option>
                    <option value="Clicking">Clicking</option>
                    <option value="Tracking">Tracking</option>
                    <option value="Switching">Switching</option>
                  </select>
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white pointer-events-none">
                    <LuArrowDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <table
                className="min-w-full bg-zinc-900 table-auto text-sm mx-auto w-full"
                style={{
                  maxHeight: '528px',
                  display: 'block',
                  overflowY: 'auto',
                }}
              >
                <thead className="text-xs font-semibold uppercase text-purple-400">
                  <tr>
                    <th className="px-4 py-2 text-left w-[5%]"></th>
                    <th className="px-4 py-2 text-left w-[30%]">
                      Playlist Name
                    </th>
                    <th className="px-4 py-2 text-left w-[25%]">Author</th>
                    <th className="px-4 py-2 text-left w-[20%]">Game</th>
                    <th className="px-4 py-2 text-left w-[20%]">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-700 transition-all duration-200"
                      >
                        <td className="px-4 py-2 w-[5%]">
                          <button
                            className="text-purple-400 hover:text-purple-500"
                            onClick={() =>
                              handlePlayClick(item.name, item.game)
                            }
                          >
                            <LuPlay />
                          </button>
                        </td>
                        <td
                          className="px-4 py-2 w-[30%] truncate text-white relative"
                          onClick={() =>
                            item.game === 'KovaaKs' &&
                            handleCopyTitle(item.name)
                          }
                        >
                          {item.name}
                          {item.game === 'KovaaKs' && !copiedTitle && (
                            <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-all duration-300">
                              <LuClipboard className="text-white w-6 h-6" />
                            </div>
                          )}
                          {copiedTitle === item.name && (
                            <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-all duration-300">
                              <LuClipboardCheck className="text-white w-6 h-6" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 w-[25%] truncate">
                          <a
                            href={`https://x.com/${item.author}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-500"
                          >
                            {item.author}
                          </a>
                        </td>
                        <td className="px-4 py-2 w-[20%] truncate">
                          {item.game}
                        </td>
                        <td className="px-4 py-2 w-[20%] truncate">
                          {item.category}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {copySuccessMessage && (
          <div className="fixed bottom-24 right-4 bg-zinc-700 text-white py-3 px-6 rounded-lg shadow-lg flex items-center justify-between space-x-3 transition-all duration-700">
            <span className="mr-4">{copySuccessMessage}</span>
            <LuClipboardCheck
              className="text-white w-6 h-6 transition-transform transform"
              style={{
                transform: copySuccessMessage
                  ? 'translateX(0)' // icon in place when message appears
                  : 'translateX(50px)', // icon flying out when message disappears
              }}
            />
          </div>
        )}

        <div className="mt-auto px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}
