'use client';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { LuDownload, LuPlay, LuPause } from 'react-icons/lu'; // Import the play and pause icons

export default function Home() {
  // Array of sound files (including OGG format)
  const soundFiles = [
    {
      name: 'Saya Cute Sound',
      url: '/sounds/saya_cute_1.ogg', // Path to the .ogg file in the public/sounds folder
    },
    {
      name: 'Song 2 - Artist B',
      url: '/mp3s/song2.mp3', // Replace with the actual path to your MP3 file
    },
    {
      name: 'Song 3 - Artist C',
      url: '/mp3s/song3.mp3', // Replace with the actual path to your MP3 file
    },
    {
      name: 'Song 4 - Artist D',
      url: '/mp3s/song4.mp3', // Replace with the actual path to your MP3 file
    },
    {
      name: 'Song 5 - Artist E',
      url: '/mp3s/song5.mp3', // Replace with the actual path to your MP3 file
    },
  ];

  // Function to format the time (currentTime) into mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // State to track if the component has mounted (client-side)
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure document is only accessed on the client-side
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // State to manage play/pause for each audio track
  const [audioStates, setAudioStates] = useState(
    soundFiles.map(() => ({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }))
  );

  // Update state when audio time updates
  const handleTimeUpdate = (index, e) => {
    const audio = e.target;
    setAudioStates((prev) =>
      prev.map((state, i) =>
        i === index
          ? {
              ...state,
              currentTime: audio.currentTime,
              duration: audio.duration,
            }
          : state
      )
    );
  };

  // Handle slider change (seeking)
  const handleSliderChange = (index, e) => {
    const audio = document.getElementById(`audio-${index}`);
    const value = e.target.value;
    audio.currentTime = (audio.duration / 100) * value;
  };

  // Toggle play/pause
  const togglePlay = (index) => {
    const audio = document.getElementById(`audio-${index}`);
    if (audio.paused) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      setAudioStates((prev) =>
        prev.map((state, i) =>
          i === index ? { ...state, isPlaying: true } : state
        )
      );
    } else {
      audio.pause();
      setAudioStates((prev) =>
        prev.map((state, i) =>
          i === index ? { ...state, isPlaying: false } : state
        )
      );
    }
  };

  // Reset the play button and slider when audio ends
  const handleAudioEnd = (index) => {
    setAudioStates((prev) =>
      prev.map((state, i) =>
        i === index
          ? {
              ...state,
              isPlaying: false,
              currentTime: 0, // Reset current time when the audio ends
            }
          : state
      )
    );
  };

  // Update duration once audio metadata is loaded
  const handleLoadedMetadata = (index, e) => {
    const audio = e.target;
    setAudioStates((prev) =>
      prev.map((state, i) =>
        i === index
          ? {
              ...state,
              duration: audio.duration, // Set duration after metadata is loaded
            }
          : state
      )
    );
  };

  // Only render the component on the client-side after mounting
  if (!hasMounted) {
    return null; // or a loading spinner if you prefer
  }

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

          {/* Sound File Container */}
          <div className="flex flex-col items-center mt-10">
            <div className="w-full max-w-screen-xl px-4">
              <div className="bg-transparent rounded-lg p-6">
                {/* Sound Files Grid */}
                <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-96 custom-scrollbar">
                  {soundFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-2 group relative"
                    >
                      <span className="text-lg">{file.name}</span>

                      {/* Audio Player */}
                      <div className="w-full max-w-xs">
                        <audio
                          id={`audio-${index}`}
                          className="w-full"
                          controlsList="nodownload noremoteplayback"
                          onTimeUpdate={(e) => handleTimeUpdate(index, e)}
                          onEnded={() => handleAudioEnd(index)} // Reset on audio end
                          onLoadedMetadata={(e) =>
                            handleLoadedMetadata(index, e)
                          } // Update duration on metadata load
                        >
                          <source src={file.url} type="audio/ogg" />
                          <source
                            src={file.url.replace('.ogg', '.mp3')}
                            type="audio/mpeg"
                          />{' '}
                          {/* Fallback MP3 */}
                          Your browser does not support the audio element.
                        </audio>

                        {/* Custom Controls */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Play/Pause Button */}
                          <button
                            className="p-2 text-purple-500 hover:text-purple-700"
                            onClick={() => togglePlay(index)}
                          >
                            {audioStates[index]?.isPlaying ? (
                              <LuPause size={24} />
                            ) : (
                              <LuPlay size={24} />
                            )}
                          </button>

                          {/* Trackbar */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              (audioStates[index]?.currentTime /
                                audioStates[index]?.duration) *
                                100 || 0
                            }
                            className="flex-grow mx-2 w-16 bg-purple-500/50 accent-purple-500"
                            onChange={(e) => handleSliderChange(index, e)}
                          />

                          {/* Timer and Download */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">
                              {formatTime(audioStates[index]?.currentTime || 0)}
                            </span>
                            <span>/</span>
                            <span className="text-sm text-gray-300">
                              {formatTime(audioStates[index]?.duration || 0)}
                            </span>

                            {/* Download Button */}
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
