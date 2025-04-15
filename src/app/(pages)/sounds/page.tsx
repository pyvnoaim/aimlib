'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import {
  FaPlay,
  FaPause,
  FaDownload,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaHeart,
} from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import Toast from '@/components/layouts/toast/toast';
import { ROLES } from '@/types/role';
import ConfirmDialog from '@/components/layouts/dialog/confirm-dialog';

type Sound = {
  fullName: string;
  name: string;
  fileUrl: string;
  submittedBy: string;
  likes: number;
  isLiked: boolean;
};

export default function Sounds() {
  const { data: session } = useSession();
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [soundToDelete, setSoundToDelete] = useState<Sound | null>(null);

  const [sortBy, setSortBy] = useState(['name', 'submittedBy']);
  const [sortOrder, setSortOrder] = useState(['asc', 'asc']);

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await fetch('/api/sounds/get-sounds');
        const data = await response.json();

        const soundFiles = data.map((fileName: string) => ({
          fullName: fileName,
          name: fileName.replace('.ogg', ''),
          fileUrl: `/sounds/${fileName}`,
          submittedBy: 'System',
          likes: 0,
          isLiked: false,
        }));

        setSounds(soundFiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sounds:', error);
        showToast('Failed to load sounds', 'error');
        setLoading(false);
      }
    };

    fetchSounds();
  }, []);

  const playSound = (fileUrl: string, id: string) => {
    const audio = new Audio(fileUrl);
    setCurrentlyPlayingId(id);
    audio.play();

    audio.onended = () => {
      setCurrentlyPlayingId(null);
    };
  };

  const handleDelete = (sound: Sound) => {
    if (session?.user.role !== ROLES.ADMIN) {
      showToast('You do not have permission to delete this sound.', 'error');
      return;
    }

    setSoundToDelete(sound);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (soundToDelete) {
      try {
        const response = await fetch('/api/sounds/delete-sound', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: soundToDelete.fullName }),
        });

        const result = await response.json();

        if (response.ok) {
          setSounds((prev) =>
            prev.filter((sound) => sound.fullName !== soundToDelete.fullName)
          );
          showToast(
            `Sound "${soundToDelete.name}" deleted successfully`,
            'success'
          );
        } else {
          showToast(result.message || 'Failed to delete sound', 'error');
        }
      } catch (error) {
        console.error('Error deleting sound:', error);
        showToast('Failed to delete sound', 'error');
      }

      setIsConfirmDialogOpen(false);
      setSoundToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setSoundToDelete(null);
  };

  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'sound.ogg';
    link.click();
    showToast('Downloading sound...', 'info');
  };

  const handleLikeToggle = (sound: Sound) => {
    const updatedSounds = sounds.map((s) =>
      s.fullName === sound.fullName
        ? {
            ...s,
            isLiked: !s.isLiked,
            likes: s.isLiked ? s.likes - 1 : s.likes + 1,
          }
        : s
    );
    setSounds(updatedSounds);
  };

  const filteredSounds = sounds.filter((sound) =>
    sound.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedSounds = filteredSounds.sort((a, b) => {
    const getValue = (sound: Sound, field: string) => {
      const value = sound[field as keyof Sound];
      return typeof value === 'number' ? value : String(value).toLowerCase();
    };

    const valueA1 = getValue(a, sortBy[0]);
    const valueB1 = getValue(b, sortBy[0]);

    if (valueA1 !== valueB1) {
      return sortOrder[0] === 'asc'
        ? valueA1 < valueB1
          ? -1
          : 1
        : valueA1 > valueB1
        ? -1
        : 1;
    }

    const valueA2 = getValue(a, sortBy[1]);
    const valueB2 = getValue(b, sortBy[1]);

    return sortOrder[1] === 'asc'
      ? valueA2 < valueB2
        ? -1
        : 1
      : valueA2 > valueB2
      ? -1
      : 1;
  });

  const toggleSort = (field: 'name' | 'submittedBy' | 'likes') => {
    if (sortBy[0] === field) {
      const newSortOrder = sortOrder[0] === 'asc' ? 'desc' : 'asc';
      setSortOrder([newSortOrder, sortOrder[1]]);
    } else if (sortBy[1] === field) {
      const newSortOrder = sortOrder[1] === 'asc' ? 'desc' : 'asc';
      setSortOrder([sortOrder[0], newSortOrder]);
    } else {
      setSortBy([field, sortBy[0]]);
      setSortOrder(['asc', sortOrder[1]]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 pt-6 pl-6 pr-6 gap-8">
          <div className="text-center mt-5">
            <h1 className="font-extrabold text-4xl text-white tracking-tight">
              SOUNDS
            </h1>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg max-w-md">
              <BiSearch className="text-md" />
              <input
                type="text"
                placeholder="Search sounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-md text-white placeholder-purple-300 w-full"
              />
            </div>
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <div className="overflow-auto max-h-[650px]">
              <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-400 sticky top-0 z-10 backdrop-blur-lg">
                    <th className="px-4 py-2">Play</th>
                    <th
                      className="px-4 py-2"
                      onClick={() => toggleSort('name')}
                    >
                      Name
                      {sortBy[0] === 'name' && sortOrder[0] === 'asc' ? (
                        <FaSortAlphaUp className="inline ml-2" />
                      ) : (
                        <FaSortAlphaDown className="inline ml-2" />
                      )}
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() => toggleSort('submittedBy')}
                    >
                      Submitted By
                      {sortBy[1] === 'submittedBy' && sortOrder[1] === 'asc' ? (
                        <FaSortAlphaUp className="inline ml-2" />
                      ) : (
                        <FaSortAlphaDown className="inline ml-2" />
                      )}
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() => toggleSort('likes')}
                    >
                      Likes
                      {sortBy[0] === 'likes' && sortOrder[0] === 'asc' ? (
                        <FaSortAlphaUp className="inline ml-2" />
                      ) : sortBy[0] === 'likes' ? (
                        <FaSortAlphaDown className="inline ml-2" />
                      ) : null}
                    </th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i} className="bg-zinc-700 animate-pulse">
                        <td className="px-4 py-2">
                          <div className="w-8 h-8 bg-zinc-600 rounded-full mx-auto" />
                        </td>

                        <td className="px-4 py-2">
                          <div className="h-4 w-36 bg-zinc-600 rounded" />
                        </td>

                        <td className="px-4 py-2">
                          <div className="h-4 w-24 bg-zinc-600 rounded" />
                        </td>

                        <td className="px-4 py-2">
                          <div className="h-4 w-12 bg-zinc-600 rounded" />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-4 justify-start">
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : sortedSounds.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        No matching sounds found.
                      </td>
                    </tr>
                  ) : (
                    sortedSounds.map((sound) => (
                      <tr
                        key={sound.fullName}
                        className="bg-zinc-700 transition-all duration-300 hover:bg-zinc-600"
                      >
                        <td className="px-4 py-2">
                          <button
                            onClick={() =>
                              currentlyPlayingId === sound.fullName
                                ? setCurrentlyPlayingId(null)
                                : playSound(sound.fileUrl, sound.fullName)
                            }
                            className="text-purple-400 hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                            aria-label={`Play ${sound.name}`}
                          >
                            {currentlyPlayingId === sound.fullName ? (
                              <FaPause className="text-xl w-4 h-4" />
                            ) : (
                              <FaPlay className="text-xl w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-2">{sound.name}</td>
                        <td className="px-4 py-2 text-purple-300">
                          {sound.submittedBy}
                        </td>
                        <td className="px-4 py-2">
                          <span>{sound.likes}</span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-4 items-center">
                            <button
                              onClick={() => handleDownload(sound.fileUrl)}
                              className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                              aria-label={`Download ${sound.name}`}
                            >
                              <FaDownload className="text-xl w-4 h-4" />
                            </button>

                            {session?.user && (
                              <button
                                onClick={() => handleLikeToggle(sound)}
                                className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                              >
                                <FaHeart
                                  className={`text-xl w-4 h-4 transition-all duration-300 ${
                                    sound.isLiked
                                      ? 'text-red-500'
                                      : 'text-white'
                                  }`}
                                />
                              </button>
                            )}

                            {session?.user?.role === ROLES.ADMIN && (
                              <button
                                onClick={() => handleDelete(sound)}
                                className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                                aria-label={`Delete ${sound.name}`}
                              >
                                <FaTrash className="text-red-500 text-xl w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={handleCloseToast}
          />

          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            message={`Are you sure you want to delete the sound "${soundToDelete?.name}.ogg"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            title="Confirm Deletion"
          />
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
