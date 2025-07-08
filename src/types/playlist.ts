export interface Playlist {
  id: string;
  name: string;
  author: string;
  twitterHandle: string;
  aimtrainer: string;
  shareCode: string;
  createdAt: string;
  updatedAt: string;
  isBenchmark: boolean;
  benchmarkLink: string;
  likes: number;
  likedByUser: boolean;
  profileImageUrl: string | null;
}
