import React from 'react';
import { FaDiscord } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex justify-center items-center py-4">
      <div className="bg-white/3 backdrop-blur-sm rounded-lg shadow-sm text-center w-full flex items-center justify-center px-6 py-3 relative outline-1">
        {/* Made by text */}
        <p className="text-white text-base">
          made by{' '}
          <a
            href="https://x.com/pyvnoaim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition duration-300"
          >
            @pyvno
          </a>{' '}
          /{' '}
          <a
            href="https://x.com/_zenvlr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition duration-300"
          >
            @zen
          </a>
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 absolute right-6">
          <a
            href="https://discord.gg/w6AvmXwXwH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-white/10 rounded-lg transition duration-300 p-2"
          >
            <FaDiscord size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
