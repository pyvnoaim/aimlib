'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { useState } from 'react';

export default function Test() {
  const [cursorImage, setCursorImage] = useState(null); // To store the selected cursor image

  const crosshairs = [
    { title: 'test1', src: 'ZeeqPlus2.png' },
    { title: 'test2', src: 'ZeeqPlus2.png' },
    { title: 'test3', src: 'ZeeqPlus2.png' },
    { title: 'test4', src: 'ZeeqPlus2.png' },
    { title: 'test5', src: 'ZeeqPlus2.png' },
    { title: 'test6', src: 'ZeeqPlus2.png' },
    { title: 'test7', src: 'ZeeqPlus2.png' },
    { title: 'test8', src: 'ZeeqPlus2.png' },
    { title: 'test9', src: 'ZeeqPlus2.png' },
    { title: 'test10', src: 'ZeeqPlus2.png' },
    { title: 'test11', src: 'ZeeqPlus2.png' },
    { title: 'test12', src: 'ZeeqPlus2.png' },
    { title: 'test13', src: 'ZeeqPlus2.png' },
    { title: 'test14', src: 'ZeeqPlus2.png' },
    { title: 'test15', src: 'ZeeqPlus2.png' },
    { title: 'test16', src: 'ZeeqPlus2.png' },
    { title: 'test17', src: 'ZeeqPlus2.png' },
    { title: 'test18', src: 'ZeeqPlus2.png' },
    { title: 'test19', src: 'ZeeqPlus2.png' },
    { title: 'test20', src: 'ZeeqPlus2.png' },
  ];

  // Change the cursor image when a crosshair is clicked
  const handleCursorChange = (crosshairSrc) => {
    setCursorImage(crosshairSrc);
  };

  // Apply the custom cursor style when a crosshair is selected
  const customCursorStyle = cursorImage
    ? {
        cursor: `url(${cursorImage}), auto`,
      }
    : {};

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
      style={customCursorStyle} // Apply the custom cursor style here
    >
      {/* Sidebar */}
      <div className="group">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow h-screen flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-1/3 mt-10">
            <h1 className="font-extrabold text-3xl text-center">TEST</h1>
            <p className="text-sm">testing</p>
          </div>

          {/* Crosshair Preview Container with Scroll */}
          <div className="flex justify-center mt-10 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8">
              {crosshairs.map((crosshair, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  {/* Image Preview with hover effect */}
                  <img
                    src={crosshair.src}
                    alt={crosshair.title}
                    className="w-24 h-24 object-contain mb-4 transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform group-hover:translate-y-4">
                    {crosshair.title}
                  </h3>
                  {/* Download Button */}
                  <a
                    href={crosshair.src} // Assuming the image is downloadable from the src
                    download
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:transition-transform group-hover:translate-y-4"
                  >
                    Download
                  </a>
                  {/* Button to Change Cursor */}
                  <button
                    onClick={() => handleCursorChange(crosshair.src)} // Set the selected crosshair as the cursor
                    className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Set as Cursor
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with extra space */}
          <div className="mt-12 px-4 transition-all duration-300">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
