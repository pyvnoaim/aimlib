'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import { MdUpload, MdDashboard } from 'react-icons/md';
import DeleteUserButton from '@/components/ui/auth-buttons/delete-user-button';
import ActionCard from '@/components/ui/dashboard-actioncards/actioncards';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import Image from 'next/image';

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams();
  const { name: username, image: userImage } = session?.user || {};

  const [title, setTitle] = useState('');
  const [type, setType] = useState('theme');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!username) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== username) {
      router.push(`/dashboard/${username}/submit`);
    }
  }, [session, status, usernameFromUrl, router, username]);

  if (!username || usernameFromUrl !== username) return null;

  const navigateTo = (path: string) => {
    if (!username) {
      router.push('/api/auth/signin');
      return;
    }
    router.push(`/dashboard/${username}${path}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files.length || !username) return;

    const uploads = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('type', type);
      formData.append('submittedBy', username);

      return fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
    });

    const results = await Promise.all(uploads);
    const allSuccessful = results.every((res) => res.ok);

    if (allSuccessful) {
      alert('All files uploaded successfully. Pending admin review.');
      setTitle('');
      setType('theme');
      setFiles([]);
    } else {
      alert('Some uploads failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={userImage || '/default-avatar.png'}
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
            <DeleteUserButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ActionCard
              icon={<MdDashboard className="text-4xl text-purple-400" />}
              title="Dashboard"
              description="Overview"
              onClick={() => navigateTo('')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<AiFillHeart className="text-4xl text-purple-400" />}
              title="Likes"
              description="View your favorites"
              onClick={() => navigateTo('/likes')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-purple-400" />}
              title="Submit"
              description="Upload new content"
              onClick={() => navigateTo('/submit')}
              className="bg-purple-400/20 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<HiShieldCheck className="text-4xl text-red-500" />}
              title="Admin"
              description="Manage users and submits"
              onClick={() => navigateTo('/admin')}
              className="bg-white/5 border-red-500/50 hover:bg-red-500/30"
            />
          </div>

          <div className="bg-zinc-800 p-8 rounded-xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Name your submission"
                  className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="theme">Theme (.json)</option>
                  <option value="crosshair">Crosshair (.png)</option>
                  <option value="sound">Sound (.ogg)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload files (max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".json,.png,.ogg"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files || []).slice(0, 5))
                  }
                  required
                  className="w-full bg-zinc-700 text-white file:bg-purple-600 file:text-white file:rounded file:border-0 file:px-4 file:py-2 file:cursor-pointer hover:file:bg-purple-700 rounded-lg"
                />
                {files.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-300 list-disc list-inside space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 px-6 rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
