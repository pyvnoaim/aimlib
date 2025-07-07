'use client';
import { useEffect, useState } from 'react';
import { LuMonitor, LuSmartphone } from 'react-icons/lu';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        // Delay visibility for smooth fade-in
        setTimeout(() => setIsVisible(true), 100);
      } else {
        setIsVisible(false);
      }
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-zinc-900 text-white flex items-center justify-center px-6 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-md text-center space-y-6">
        <div className="relative flex justify-center items-center">
          <div className="absolute">
            <LuSmartphone className="w-12 h-12 text-red-400 animate-bounce" />
          </div>
          <div className="ml-16 opacity-60">
            <LuMonitor className="w-16 h-16 text-purple-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Desktop Experience Required
          </h1>

          <div className="space-y-3">
            <p className="text-zinc-400 leading-relaxed">
              This application is optimized for desktop and larger screens to
              provide the best possible experience.
            </p>

            <div className="bg-zinc-800 backdrop-blur-sm rounded-xl p-4 border border-zinc-700">
              <p className="text-sm text-zinc-400 mb-2">
                <strong className="text-white">Minimum Requirements:</strong>
              </p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Screen width: 1024px or wider</li>
                <li>• Desktop or large tablet in landscape mode</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-3 bg-purple-500/20 border border-purple-500/50 rounded-xl">
          <p className="text-sm text-purple-400">
            💡 Try rotating your device to landscape mode or visit from a
            computer
          </p>
        </div>
      </div>
    </div>
  );
}
