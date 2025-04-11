'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiHeart, BiUpload, BiBell, BiUser } from 'react-icons/bi';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import Image from 'next/image';

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username;

  const username = session?.user?.name || 'User';
  const userImage = session?.user?.image || '/default-avatar.png';

  const [fileType, setFileType] = useState(''); // Selected file type
  const [files, setFiles] = useState({
    theme: [],
    sound: [],
    crosshair: [],
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== session?.user?.name) {
      router.push(`/dashboard/${session.user.name}/submit`);
    }
  }, [session, status, usernameFromUrl, router]);

  if (!session?.user || usernameFromUrl !== session?.user?.name) return null;

  // Handlers for stat cards
  const handleDashboardClick = () => {
    router.push(`/dashboard/${session?.user?.name}`);
  };

  const handleLikesClick = () => {
    router.push(`/dashboard/${session?.user?.name}/likes`);
  };

  const handleSubmitClick = () => {
    router.push(`/dashboard/${session?.user?.name}/submit`);
  };

  const handleUserClick = () => {
    router.push(`/dashboard/${session?.user?.name}/admin`);
  };

  // Handle file type selection
  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
    // Clear selected files when file type changes
    setFiles({
      theme: [],
      sound: [],
      crosshair: [],
    });
  };

  // Handle file selection
  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: selectedFiles,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a file submission
    alert('Files submitted successfully!');
    // You can add actual file upload logic here
    console.log('Submitted files:', files);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={userImage}
              alt="User Profile"
              className="w-16 h-16 rounded-full"
              width={64}
              height={64}
            />
            <div className="flex-grow">
              <h1 className="font-extrabold text-4xl">
                Welcome back,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 text-4xl">
                  {username}
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Submit your files here.</p>
            </div>
            <SignOutButton />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Dashboard */}
            <div
              className="flex items-center gap-4 bg-blue-500/20 p-4 rounded-xl border border-blue-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-blue-500/30"
              onClick={handleDashboardClick}
            >
              <BiBell className="text-4xl text-blue-500" />
              <div>
                <p className="text-lg font-semibold">Dashboard</p>
                <p className="text-sm text-gray-400">Overview & stats</p>
              </div>
            </div>

            {/* Likes */}
            <div
              className="flex items-center gap-4 bg-pink-500/20 p-4 rounded-xl border border-pink-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-pink-500/30"
              onClick={handleLikesClick}
            >
              <BiHeart className="text-4xl text-pink-500" />
              <div>
                <p className="text-lg font-semibold">Likes</p>
                <p className="text-sm text-gray-400">View your favorites</p>
              </div>
            </div>

            {/* Submit */}
            <div
              className="flex items-center gap-4 bg-green-500/20 p-4 rounded-xl border border-green-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-500/30"
              onClick={handleSubmitClick}
            >
              <BiUpload className="text-4xl text-green-500" />
              <div>
                <p className="text-lg font-semibold">Submit</p>
                <p className="text-sm text-gray-400">Upload new content</p>
              </div>
            </div>

            {/* User */}
            <div
              className="flex items-center gap-4 bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-yellow-500/30"
              onClick={handleUserClick}
            >
              <BiUser className="text-4xl text-yellow-500" />
              <div>
                <p className="text-lg font-semibold">User</p>
                <p className="text-sm text-gray-400">Manage users (Admin)</p>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Submit Your Files</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Type Dropdown */}
              <div className="flex flex-col">
                <label
                  htmlFor="fileType"
                  className="text-lg font-semibold text-gray-300"
                >
                  Choose file type to submit
                </label>
                <select
                  id="fileType"
                  value={fileType}
                  onChange={handleFileTypeChange}
                  className="mt-2 p-2 rounded-lg text-gray-700"
                >
                  <option value="">Select file type</option>
                  <option value="sound">Sounds (.ogg)</option>
                  <option value="theme">Themes (.json)</option>
                  <option value="crosshair">Crosshairs (.png)</option>
                </select>
              </div>

              {/* Dynamic File Input Based on File Type */}
              {fileType === 'sound' && (
                <div className="flex flex-col">
                  <label
                    htmlFor="sound"
                    className="text-lg font-semibold text-gray-300"
                  >
                    Upload .ogg (Sound files)
                  </label>
                  <input
                    id="sound"
                    type="file"
                    accept=".ogg"
                    multiple
                    onChange={(e) => handleFileChange(e, 'sound')}
                    className="mt-2 text-gray-700 p-2 rounded-lg"
                  />
                  {files.sound.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Files selected:{' '}
                      {files.sound.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {fileType === 'theme' && (
                <div className="flex flex-col">
                  <label
                    htmlFor="theme"
                    className="text-lg font-semibold text-gray-300"
                  >
                    Upload .json (Theme files)
                  </label>
                  <input
                    id="theme"
                    type="file"
                    accept=".json"
                    multiple
                    onChange={(e) => handleFileChange(e, 'theme')}
                    className="mt-2 text-gray-700 p-2 rounded-lg"
                  />
                  {files.theme.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Files selected:{' '}
                      {files.theme.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {fileType === 'crosshair' && (
                <div className="flex flex-col">
                  <label
                    htmlFor="crosshair"
                    className="text-lg font-semibold text-gray-300"
                  >
                    Upload .png (Crosshair files)
                  </label>
                  <input
                    id="crosshair"
                    type="file"
                    accept=".png"
                    multiple
                    onChange={(e) => handleFileChange(e, 'crosshair')}
                    className="mt-2 text-gray-700 p-2 rounded-lg"
                  />
                  {files.crosshair.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Files selected:{' '}
                      {files.crosshair.map((file) => file.name).join(', ')}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Submit Files
              </button>
            </form>
          </div>
        </main>

        <div className="px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}
