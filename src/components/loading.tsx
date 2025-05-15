'use client';

import Background from './background';

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white items-center justify-center">
      <Background />
      <div className="animate-pulse text-xl font-medium">Loading...</div>
    </div>
  );
}
