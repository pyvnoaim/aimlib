import LogoutButton from '@/components/logout-button';
import DeleteAccountButton from './delete-account-button';
import { Avatar } from '@heroui/avatar';

interface DashboardHeaderProps {
  userImage: string;
  username: string;
  subtitle?: string;
}

export const DashboardHeader = ({
  userImage,
  username,
  subtitle,
}: DashboardHeaderProps) => (
  <section className="flex items-center gap-4 mb-8">
    <Avatar
      src={userImage}
      showFallback
      name={username.charAt(0).toUpperCase()}
      className="w-20 h-20 text-4xl"
      radius="full"
    />
    <div className="flex-grow">
      <h1 className="font-extrabold text-4xl">
        Welcome back,{' '}
        <span className="text-purple-400 text-4xl">{username}</span>
      </h1>
      <p className="text-gray-400 text-lg">{subtitle}</p>
    </div>
    <div className="flex gap-2">
      <LogoutButton />
      <DeleteAccountButton />
    </div>
  </section>
);
