import { MdDashboard, MdUpload } from 'react-icons/md';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import ActionCard from '@/components/menu-cards';

interface DashboardActionsProps {
  isAdmin: boolean;
  navigateTo: (path: string) => void;
}

const commonCardStyles =
  'bg-gradient-to-br from-white/5 to-white/10 border rounded-2xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md';

export const DashboardTabs = ({
  isAdmin,
  navigateTo,
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
        className={`${commonCardStyles} border-purple-400/40 hover:bg-purple-100/10`}
      />
      <ActionCard
        icon={<AiFillHeart className="text-4xl text-pink-500" />}
        title="Likes"
        description="View your favorites"
        onClick={() => navigateTo('/likes')}
        className={`${commonCardStyles} border-pink-400/40 hover:bg-pink-100/10`}
      />
      <ActionCard
        icon={<MdUpload className="text-4xl text-indigo-500" />}
        title="Submit"
        description="Upload new content"
        onClick={() => navigateTo('/submit')}
        className={`${commonCardStyles} border-indigo-400/40 hover:bg-indigo-100/10`}
      />
      {isAdmin && (
        <ActionCard
          icon={<HiShieldCheck className="text-4xl text-red-600" />}
          title="Admin"
          description="Manage users and submits"
          onClick={() => navigateTo('/admin')}
          className={`${commonCardStyles} border-red-500/50 bg-red-500/10 hover:bg-red-500/20`}
        />
      )}
    </section>
  );
};
