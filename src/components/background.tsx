import { Spotlight } from '@/components/spotlightNew';

export default function Background() {
  return (
    <div>
      <Spotlight />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>
    </div>
  );
}
