import React from 'react';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { Tooltip } from '@heroui/react';

const Footer: React.FC = () => {
  return (
    <footer className="hidden sm:flex w-full justify-center items-center px-8 pb-6 z-10">
      <div className="bg-zinc-800 rounded-lg shadow-lg text-center w-full flex items-center justify-center py-3 relative border border-zinc-700">
        <div className="flex items-center space-x-2 absolute left-4">
          <div className="w-6 h-6 bg-[#ff9a9a] rounded-sm"></div>
          <span className="text-white text-sm">ritual</span>
        </div>
        <p className="text-white">
          made with <span className="text-red-500">❤︎</span> by{' '}
          <Tooltip
            delay={200}
            closeDelay={0}
            classNames={{
              content: [
                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
              ],
            }}
            content="View pyvno on X"
          >
            <a
              href="https://x.com/pyvnoaim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
            >
              @pyvno
            </a>
          </Tooltip>{' '}
          /{' '}
          <Tooltip
            delay={200}
            closeDelay={0}
            classNames={{
              content: [
                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
              ],
            }}
            content="View opal on X"
          >
            <a
              href="https://x.com/opalesnt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
            >
              @opal
            </a>
          </Tooltip>{' '}
          /{' '}
          <Tooltip
            delay={200}
            closeDelay={0}
            classNames={{
              content: [
                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
              ],
            }}
            content="View Shishigami on X"
          >
            <a
              href="https://x.com/ShishigamiTV"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 transition-transform duration-300 ease-out hover:-translate-y-1 inline-block"
            >
              @shishigami
            </a>
          </Tooltip>
        </p>
        <div className="flex space-x-4 absolute right-4">
          <Tooltip
            closeDelay={0}
            classNames={{
              content: [
                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
              ],
            }}
            content="Github Repository"
          >
            <a
              href="https://github.com/pyvnoaim/aimlib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:bg-zinc-700 rounded-md transition duration-300 p-2"
            >
              <FaGithub size={20} />
            </a>
          </Tooltip>
          <Tooltip
            closeDelay={0}
            classNames={{
              content: [
                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
              ],
            }}
            content="Join our Discord"
          >
            <a
              href="https://discord.gg/w6AvmXwXwH"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:bg-zinc-700 rounded-md transition duration-300 p-2"
            >
              <FaDiscord size={20} />
            </a>
          </Tooltip>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
