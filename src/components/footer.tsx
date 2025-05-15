import React from 'react';
import { FaDiscord, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="hidden sm:flex w-full justify-center items-center px-8 pb-4 z-10">
      <div className="bg-zinc-800 rounded-lg shadow-lg text-center w-full flex items-center justify-center py-3 relative border border-zinc-700">
        <p className="text-white">
          made with <span className="text-red-500 animate-pulse">❤︎</span> by{' '}
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
            @shishigami
          </a>
        </p>
        <div className="flex space-x-4 absolute right-4">
          <a
            href="https://github.com/pyvnoaim/aimlib"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-700 rounded-md transition duration-300 p-2"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://discord.gg/w6AvmXwXwH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:bg-zinc-700 rounded-md transition duration-300 p-2"
          >
            <FaDiscord size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
