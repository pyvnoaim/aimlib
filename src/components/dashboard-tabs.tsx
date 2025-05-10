import { MdDashboard, MdUpload } from 'react-icons/md';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import ActionCard from '@/components/menu-cards';

interface DashboardActionsProps {
  isAdmin: boolean;
  navigateTo: (path: string) => void;
  currentPath: string;
}

const commonCardStyles =
  'border rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md';

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
          currentPath === '/dashboard' ? 'bg-purple-500/20' : 'bg-white/5'
        } ${commonCardStyles} border-purple-500/50 hover:bg-purple-500/20`}
      />
      <ActionCard
        icon={<AiFillHeart className="text-4xl text-pink-500" />}
        title="Likes"
        description="View your favorites"
        onClick={() => navigateTo('/likes')}
        className={`${
          currentPath === '/likes' ? 'bg-pink-500/20' : 'bg-white/5'
        } ${commonCardStyles} border-pink-500/50 hover:bg-pink-500/20`}
      />
      <ActionCard
        icon={<MdUpload className="text-4xl text-indigo-500" />}
        title="Submit"
        description="Upload new content"
        onClick={() => navigateTo('/submit')}
        className={`${
          currentPath === '/submit' ? 'bg-indigo-500/20' : 'bg-white/5'
        } ${commonCardStyles} border-indigo-500/50 hover:bg-indigo-500/20`}
      />
      {isAdmin && (
        <ActionCard
          icon={<HiShieldCheck className="text-4xl text-red-500" />}
          title="Admin"
          description="Manage users and submits"
          onClick={() => navigateTo('/admin')}
          className={`${
            currentPath.startsWith('/admin') ? 'bg-red-500/20' : 'bg-white/5'
          } ${commonCardStyles} border-red-500/50 hover:bg-red-500/20`}
        />
      )}
    </section>
  );
};
