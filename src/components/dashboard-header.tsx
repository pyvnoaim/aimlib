import Image from 'next/image';
import LogoutButton from '@/components/logout-button';
import DeleteAccountButton from './delete-account-button';

interface DashboardHeaderProps {
  userImage: string;
  username: string;
  subtitle?: string;
}

export const DashboardHeader = ({
  userImage,
  username,
  subtitle = 'Here is your dashboard',
}: DashboardHeaderProps) => (
  <section className="flex items-center gap-4 mb-8">
    <Image
      src={userImage}
      alt="User Profile"
      className="w-16 h-16 rounded-full"
      width={64}
      height={64}
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
