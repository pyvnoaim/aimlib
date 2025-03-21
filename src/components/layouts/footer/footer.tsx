import React from 'react';
import { FaGithub, FaXTwitter, FaDiscord } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full flex justify-center items-center py-4 z-50">
      <div className="bg-white/3 backdrop-blur-sm rounded-lg shadow-sm text-center mx-4 w-[calc(100%-32px)] flex items-center justify-center px-6 py-3 relative outline-1">
        {/* Made by @pyvno (centered) */}
        <p className="text-white text-base">
          made by{' '}
          <a
            href="https://x.com/pyvnoaim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition duration-300"
          >
            @pyvno
          </a>
        </p>

        <div className="flex space-x-4 absolute right-6">
          <a
            href="https://github.com/pyvnoaim/aimlib"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 p-2"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com/pyvnoaim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 p-2"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href="https://discord.gg/ScQE38x4rj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-600 rounded-lg transition duration-300 p-2"
          >
            <FaDiscord size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
