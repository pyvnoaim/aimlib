'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { LuDownload } from 'react-icons/lu'; // Import the download icon
import { useState } from 'react'; // For managing state like current time

export default function Home() {
  // Array of test MP3s for demonstration
  const mp3Files = Array.from({ length: 20 }, (_, index) => ({
    name: `Test MP3 ${index + 1}`,
    url: `/path/to/mp3/test-mp3-${index + 1}.mp3`, // Replace with actual file paths
  }));

  // Function to format the time (currentTime) into mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="group">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3 mt-10">
            <h1 className="font-extrabold text-3xl text-center">TESTS</h1>
          </div>

          {/* MP3 Container with Transparent Background */}
          <div className="flex flex-col items-center mt-10">
            <div className="w-full max-w-screen-xl px-4">
              <div className="bg-transparent rounded-lg p-6">
                {/* MP3 Grid */}
                <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-96 custom-scrollbar">
                  {mp3Files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-2 group relative" // Add relative positioning to group for download button positioning
                    >
                      <span className="text-lg">{file.name}</span>

                      {/* Custom Audio Controls */}
                      <div className="w-full max-w-xs">
                        <audio
                          id={`audio-${index}`}
                          className="w-full"
                          controlsList="nodownload noremoteplayback" // Hides other controls like download, fullscreen
                          onTimeUpdate={(e) => {
                            const audio = e.target;
                            // Update the current time display
                            const currentTimeElement = document.getElementById(
                              `current-time-${index}`
                            );
                            const durationElement = document.getElementById(
                              `duration-${index}`
                            );
                            if (currentTimeElement && durationElement) {
                              currentTimeElement.textContent = formatTime(
                                audio.currentTime
                              );
                              durationElement.textContent = formatTime(
                                audio.duration
                              );
                            }
                          }}
                        >
                          <source src={file.url} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>

                        {/* Custom Control Bar */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Play Button */}
                          <button
                            className="p-2 text-purple-500 hover:text-purple-700"
                            onClick={() => {
                              const audio = document.getElementById(
                                `audio-${index}`
                              );
                              if (audio.paused) {
                                audio.play();
                              } else {
                                audio.pause();
                              }
                            }}
                          >
                            {document.getElementById(`audio-${index}`)
                              ?.paused ? (
                              <span>▶️</span> // Play icon
                            ) : (
                              <span>❚❚</span> // Pause icon
                            )}
                          </button>

                          {/* Shortened Trackbar */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="0"
                            className="flex-grow mx-2 w-16 bg-purple-500/50 accent-purple-500" // Shortened slider with purple color
                            onChange={(e) => {
                              const audio = document.getElementById(
                                `audio-${index}`
                              );
                              const value = e.target.value;
                              audio.currentTime =
                                (audio.duration / 100) * value;
                            }}
                          />

                          {/* Timer and Download Button Positioned Together */}
                          <div className="flex items-center space-x-2">
                            <span
                              id={`current-time-${index}`}
                              className="text-sm text-gray-300"
                            >
                              0:00
                            </span>
                            <span>/</span>
                            <span
                              id={`duration-${index}`}
                              className="text-sm text-gray-300"
                            >
                              0:00
                            </span>

                            {/* Download Button - Positioned next to the timer */}
                            <a
                              href={file.url}
                              download
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-md border border-purple-500/50 shadow-lg hover:border-purple-500"
                            >
                              <LuDownload size={20} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
