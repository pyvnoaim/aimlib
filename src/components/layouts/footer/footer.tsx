import React from 'react';
import { FaDiscord } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="hidden sm:flex w-full justify-center items-center py-4">
      <div className="bg-zinc-800 backdrop-blur-sm rounded-lg shadow-sm text-center w-full flex items-center justify-center px-6 py-3 relative outline-1">
        {/* Made by text */}
        <p className="text-white text-base">
          made by{' '}
          <a
            href="https://x.com/pyvnoaim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
          >
            @pyvno
          </a>{' '}
          /{' '}
          <a
            href="https://x.com/_zenvlr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
          >
            @zen
          </a>{' '}
          /{' '}
          <a
            href="https://x.com/opalesnt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
          >
            @opal
          </a>{' '}
          /{' '}
          <a
            href="https://x.com/ShishigamiTV"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
          >
            @Shishigami
          </a>
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 absolute right-6">
          <a
            href="https://discord.gg/w6AvmXwXwH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-700 rounded-lg transition duration-300 p-2"
          >
            <FaDiscord size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
