'use client';
export default function Loading() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white items-center justify-center">
      <div className="animate-pulse text-xl font-medium">Loading...</div>
    </div>
  );
}
