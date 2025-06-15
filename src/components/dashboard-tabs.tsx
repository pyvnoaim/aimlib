import { MdDashboard, MdUpload } from 'react-icons/md';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {icon}
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};

interface DashboardActionsProps {
  isAdmin: boolean;
  navigateTo: (path: string) => void;
  currentPath: string;
}

const commonCardStyles =
  'backdrop-blur-lg border rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02]';

export const DashboardTabs = ({
  isAdmin,
  navigateTo,
  currentPath,
}: DashboardActionsProps) => {
  return (
    <section
      className={`grid ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} gap-6 mb-8`}
    >
      <ActionCard
        icon={<MdDashboard className="text-4xl text-purple-500" />}
        title="Dashboard"
        description="Overview"
        onClick={() => navigateTo('')}
        className={`${
          currentPath === '/dashboard'
            ? 'bg-purple-500/20 border-purple-500/50'
            : 'bg-zinc-800 border-zinc-700'
        } ${commonCardStyles} border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-500/70`}
      />
      <ActionCard
        icon={<AiFillHeart className="text-4xl text-pink-500" />}
        title="Likes"
        description="Everything you've liked"
        onClick={() => navigateTo('/likes')}
        className={`${
          currentPath === '/likes'
            ? 'bg-pink-500/20 border-pink-500/50'
            : 'bg-zinc-800 border-zinc-700'
        } ${commonCardStyles} border-pink-500/50 hover:bg-pink-500/20 hover:border-pink-500/70`}
      />
      <ActionCard
        icon={<MdUpload className="text-4xl text-indigo-500" />}
        title="Submit"
        description="Upload new content"
        onClick={() => navigateTo('/submit')}
        className={`${
          currentPath === '/submit'
            ? 'bg-indigo-500/20 border-indigo-500/50'
            : 'bg-zinc-800 border-zinc-700'
        } ${commonCardStyles} border-indigo-500/50 hover:bg-indigo-500/20 hover:border-indigo-500/70`}
      />
      {isAdmin && (
        <ActionCard
          icon={<HiShieldCheck className="text-4xl text-red-500" />}
          title="Admin"
          description="Manage users and submissions"
          onClick={() => navigateTo('/admin')}
          className={`${
            currentPath.startsWith('/admin')
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-zinc-800 border-zinc-700'
          } ${commonCardStyles} border-red-500/50 hover:bg-red-500/20 hover:border-red-500/70`}
        />
      )}
    </section>
  );
};
