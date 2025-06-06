'use client';
import { BiSolidTime, BiPlay, BiHeart, BiShare, BiCopy } from 'react-icons/bi';
import { useState } from 'react';
import Background from '@/components/background';
import Footer from '@/components/footer';

const mockPlaylists: {
  id: number;
  name: string;
  author: string;
  likes: number;
  aimtrainer: 'Aimlabs' | 'Kovaaks';
  shareCode: string;
  playTime: string;
}[] = [
  {
    id: 1,
    name: 'Pro Precision Pack',
    author: 'AimGod2024',
    likes: 2847,
    aimtrainer: 'Aimlabs',
    shareCode: 'AIMLAB-PRO-2024-X1',
    playTime: '45min',
  },
  {
    id: 2,
    name: 'Flick Master Series',
    author: 'FlickKing',
    likes: 1923,
    aimtrainer: 'Kovaaks',
    shareCode: 'KVK-FLICK-MASTER-99',
    playTime: '32min',
  },
  {
    id: 3,
    name: 'Tracking Intensive',
    author: 'SmoothAimer',
    likes: 3156,
    aimtrainer: 'Aimlabs',
    shareCode: 'AIMLAB-TRACK-INT-42',
    playTime: '28min',
  },
  {
    id: 4,
    name: 'Valorant Warmup',
    author: 'ValorantPro',
    likes: 4521,
    aimtrainer: 'Kovaaks',
    shareCode: 'KVK-VAL-WARM-2024',
    playTime: '20min',
  },
  {
    id: 5,
    name: 'Speed & Accuracy',
    author: 'QuickScope',
    likes: 1687,
    aimtrainer: 'Aimlabs',
    shareCode: 'AIMLAB-SPEED-ACC-77',
    playTime: '35min',
  },
  {
    id: 6,
    name: 'CS2 Perfection',
    author: 'CounterAim',
    likes: 2934,
    aimtrainer: 'Kovaaks',
    shareCode: 'KVK-CS2-PERF-2024',
    playTime: '40min',
  },
];

export default function Playlists() {
  const [likedPlaylists, setLikedPlaylists] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState('');

  const handleLike = (playlistId: number) => {
    const newLiked = new Set(likedPlaylists);
    if (newLiked.has(playlistId)) {
      newLiked.delete(playlistId);
    } else {
      newLiked.add(playlistId);
    }
    setLikedPlaylists(newLiked);
  };

  const handleCopyCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(shareCode);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getAimtrainerColor = (aimtrainer: 'Aimlabs' | 'Kovaaks') => {
    return aimtrainer === 'Aimlabs'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      : 'bg-orange-500/20 text-orange-400 border-orange-500/50';
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />

      <div className="flex-grow h-screen flex flex-col z-10 relative">
        {/* Header Section */}
        <header className="p-8 pb-4">
          <div className="text-center space-y-4">
            <h1 className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              PLAYLISTS
            </h1>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm">
                <BiSolidTime className="text-lg" />
                <span className="text-sm font-medium tracking-wide">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow px-8 pb-8">
          <div className="bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-zinc-700/50 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-700/50 border-b border-zinc-600">
                    <th className="p-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Play
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Playlist
                    </th>
                    <th className="p-4 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="p-4 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="p-4 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Aimtrainer
                    </th>
                    <th className="p-4 text-center text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Zeit
                    </th>
                    <th className="p-4 text-right text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockPlaylists.map((playlist, index) => (
                    <tr
                      key={playlist.id}
                      className="border-b border-zinc-700/30 hover:bg-zinc-700/30 transition-all duration-200 group"
                    >
                      <td className="p-4">
                        <button className="w-10 h-10 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
                          <BiPlay className="text-xl text-white ml-0.5" />
                        </button>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {playlist.name}
                          </div>
                          <div className="text-sm text-zinc-400 font-mono bg-zinc-700/50 px-2 py-1 rounded mt-1 inline-block">
                            {playlist.shareCode}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-zinc-300 font-medium">
                          {playlist.author}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BiHeart
                            className={`text-lg ${
                              likedPlaylists.has(playlist.id)
                                ? 'text-red-500'
                                : 'text-zinc-500'
                            }`}
                          />
                          <span className="text-zinc-300 font-medium">
                            {playlist.likes.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAimtrainerColor(
                            playlist.aimtrainer
                          )}`}
                        >
                          {playlist.aimtrainer}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-zinc-700 px-3 py-1 rounded-full text-sm font-medium text-zinc-300">
                          {playlist.playTime}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleLike(playlist.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              likedPlaylists.has(playlist.id)
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-red-400'
                            }`}
                          >
                            <BiHeart className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleCopyCode(playlist.shareCode)}
                            className="p-2 bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-blue-400 rounded-lg transition-all duration-200"
                          >
                            <BiCopy className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {mockPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-zinc-700/50 rounded-xl p-4 border border-zinc-600/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {playlist.name}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        by {playlist.author}
                      </p>
                    </div>
                    <button className="w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-all duration-200">
                      <BiPlay className="text-xl text-white ml-0.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <BiHeart
                        className={
                          likedPlaylists.has(playlist.id)
                            ? 'text-red-500'
                            : 'text-zinc-500'
                        }
                      />
                      <span>{playlist.likes.toLocaleString()}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getAimtrainerColor(
                        playlist.aimtrainer
                      )}`}
                    >
                      {playlist.aimtrainer}
                    </span>
                    <span className="bg-zinc-600 px-2 py-1 rounded-full text-xs">
                      {playlist.playTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                      {playlist.shareCode}
                    </code>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLike(playlist.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          likedPlaylists.has(playlist.id)
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-zinc-600 text-zinc-400 hover:text-red-400'
                        }`}
                      >
                        <BiHeart className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleCopyCode(playlist.shareCode)}
                        className="p-2 bg-zinc-600 text-zinc-400 hover:text-blue-400 rounded-lg transition-all duration-200"
                      >
                        <BiCopy className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Toast notification for copied code */}
      {copiedCode && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Code copied: {copiedCode}
        </div>
      )}
    </div>
  );
}
