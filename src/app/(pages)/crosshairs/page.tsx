'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiSearch } from 'react-icons/bi';
import { FaEye, FaHeart, FaTrash } from 'react-icons/fa';
import { LuZoomIn, LuZoomOut, LuX, LuDownload } from 'react-icons/lu';

import Toast from '@/components/layouts/toast/toast';
import ConfirmDialog from '@/components/layouts/dialog/confirm-dialog';
import { ROLES } from '@/types/role';
import { Resource } from '@/types/resource';

type Crosshair = Resource & {
  fullName: string;
  submittedBy: string;
  likes: number;
  isLiked: boolean;
  fileUrl: string;
};

export default function Crosshairs() {
  const { data: session } = useSession();
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewCrosshair, setPreviewCrosshair] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
    isVisible: false,
  });
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [crosshairToDelete, setCrosshairToDelete] = useState<Crosshair | null>(
    null
  );

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    async function fetchCrosshairs() {
      try {
        const res = await fetch('/api/crosshairs/get-crosshairs');
        const crosshairData: [Resource] = await res.json();

        const crosshairFiles: Crosshair[] = crosshairData
          .map((resource) => ({
            ...resource,
            fullName: resource.name,
            name: resource.name.replace('.png', ''),
            fileUrl: resource.filePath,
            submittedBy: resource.submittedBy,
            likes: resource.likes,
            isLiked: resource.isLiked,
          }))
          .sort((a, b) => {
            if (b.likes !== a.likes) {
              return b.likes - a.likes;
            }
            return a.name.localeCompare(b.name);
          });

        setCrosshairs(crosshairFiles);
      } catch {
        showToast('Failed to load crosshairs', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchCrosshairs();
  }, []);

  useEffect(() => {
    if (previewCrosshair) {
      setZoomLevel(1);
    }
  }, [previewCrosshair]);

  const filteredCrosshairs = crosshairs.filter((crosshair) => {
    return crosshair.name.toLowerCase().includes(search.toLowerCase());
  });

  const handlePreviewClick = (crosshair: string) => {
    setPreviewCrosshair(crosshair);
  };

  const closePreview = () => {
    setPreviewCrosshair(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevel((prevZoom) => {
      const newZoom = prevZoom + delta;
      return Math.max(0.5, Math.min(5, newZoom));
    });
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(5, prevZoom + 0.2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(0.5, prevZoom - 0.2));
  };

  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'Default.png';
    link.click();
    showToast('Downloading crosshair...', 'info');
  };

  const handleLike = async (crosshair: Crosshair) => {
    try {
      const response = await fetch('/api/likes/like-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: crosshair.id }),
      });

      if (!response.ok) throw new Error();

      const result = await response.json();

      setCrosshairs((prev) =>
        prev.map((s) =>
          s.fullName === crosshair.fullName
            ? {
                ...s,
                isLiked: result.liked,
                likes: s.likes + (result.liked ? 1 : -1),
              }
            : s
        )
      );

      showToast(
        `You ${result.liked ? 'liked' : 'unliked'} "${crosshair.name}"`,
        'success'
      );
    } catch {
      showToast('Failed to toggle like', 'error');
    }
  };

  const handleDelete = (crosshair: Crosshair) => {
    if (session?.user.role !== ROLES.ADMIN) {
      showToast(
        'You do not have permission to delete this crosshair.',
        'error'
      );
      return;
    }

    setCrosshairToDelete(crosshair);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!crosshairToDelete) return;

    try {
      const response = await fetch('/api/crosshairs/delete-crosshair', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: crosshairToDelete.fullName }),
      });

      const result = await response.json();

      if (response.ok) {
        setCrosshairs((prev) =>
          prev.filter((s) => s.fullName !== crosshairToDelete.fullName)
        );
        showToast(
          `Crosshair "${crosshairToDelete.name}" deleted successfully`,
          'success'
        );
      } else {
        showToast(result.message || 'Failed to delete crosshair', 'error');
      }
    } catch {
      showToast('Failed to delete crosshair', 'error');
    }

    setIsConfirmDialogOpen(false);
    setCrosshairToDelete(null);
  };

  const cancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setCrosshairToDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col pt-6 px-6 gap-8">
          <div className="text-center mt-5">
            <h1 className="font-extrabold text-4xl text-white tracking-tight">
              CROSSHAIRS
            </h1>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg max-w-md">
              <BiSearch className="text-md" />
              <input
                type="text"
                placeholder="Search crosshairs..."
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
                    <th className="px-4 py-2">Preview</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Submitted By</th>
                    <th className="px-4 py-2">Likes</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(20)].map((_, i) => (
                      <tr key={i} className="bg-zinc-700 animate-pulse">
                        <td className="px-4 py-2">
                          <div className="w-10 h-10 bg-zinc-600 rounded-full" />
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
                          <div className="flex gap-4">
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredCrosshairs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        No crosshairs found.
                      </td>
                    </tr>
                  ) : (
                    filteredCrosshairs.map((crosshair) => (
                      <tr
                        key={crosshair.id}
                        className="bg-zinc-700 hover:bg-zinc-600 transition-all"
                      >
                        <td className="px-4 py-2">
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Image
                              src={crosshair.filePath}
                              width={40}
                              height={40}
                              quality={100}
                              alt={crosshair.name}
                              loader={({ src }) => src}
                              className="transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">{crosshair.name}</td>
                        <td className="px-4 py-2 text-purple-300">
                          {crosshair.submittedBy}
                        </td>
                        <td className="px-4 py-2">{crosshair.likes}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-4 items-center">
                            <button
                              onClick={() =>
                                handlePreviewClick(crosshair.fullName)
                              }
                              className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDownload(crosshair.fileUrl)}
                              className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                            >
                              <LuDownload className="w-4 h-4" />
                            </button>

                            {session?.user?.id && (
                              <button
                                onClick={() => handleLike(crosshair)}
                                className={`rounded-lg p-2 transition-all duration-300 ${
                                  crosshair.isLiked
                                    ? 'text-red-500 hover:bg-red-500/20'
                                    : 'text-white hover:bg-white/10'
                                }`}
                              >
                                <FaHeart
                                  className={`w-4 h-4 ${
                                    crosshair.isLiked
                                      ? 'text-red-500'
                                      : 'text-white'
                                  }`}
                                />
                              </button>
                            )}

                            {session?.user?.role === ROLES.ADMIN && (
                              <button
                                onClick={() => handleDelete(crosshair)}
                                className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                              >
                                <FaTrash className="text-red-500 w-4 h-4" />
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

          {previewCrosshair && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={closePreview}
            >
              <div
                className="bg-zinc-800 p-8 rounded-xl shadow-2xl flex flex-col items-center gap-6 max-w-2xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex justify-between items-center">
                  <h3 className="text-2xl font-bold">
                    {previewCrosshair.replace('.png', '')}
                  </h3>
                  <button
                    onClick={closePreview}
                    className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                  >
                    <LuX className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-700 w-full overflow-hidden">
                  <div className="flex justify-end mb-2 gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg"
                      aria-label="Zoom out"
                    >
                      <LuZoomOut className="w-4 h-4" />
                    </button>
                    <div className="bg-zinc-700 px-3 py-1 rounded-lg text-sm flex items-center">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                    <button
                      onClick={handleZoomIn}
                      className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg"
                      aria-label="Zoom in"
                    >
                      <LuZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    ref={previewContainerRef}
                    className="overflow-auto flex items-center justify-center"
                    onWheel={handleWheel}
                    style={{
                      height: '300px',
                      cursor: 'zoom-in',
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      <Image
                        src={`/crosshairs/${previewCrosshair}`}
                        width={300}
                        height={300}
                        quality={100}
                        alt={previewCrosshair}
                        loader={({ src }) => src}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={handleCloseToast}
          />

          <ConfirmDialog
            isOpen={isConfirmDialogOpen}
            message={`Are you sure you want to delete the crosshair "${crosshairToDelete?.name}.png"?`}
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
