export interface PlaylistResource {
  id: number;
  name: string;
  author: string;
  twitterHandle: string;
  aimtrainer: "KovaaK's" | 'Aimlabs';
  shareCode: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedByUser?: boolean;
  profileImageUrl?: string;
}

export interface BenchmarkResource {
  id: number;
  name: string;
  author: string;
  twitterHandle: string;
  aimtrainer: "KovaaK's" | 'Aimlabs';
  shareCode: string;
  benchmarkLink: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedByUser?: boolean;
  profileImageUrl?: string;
}

export interface SoundResource {
  id: number;
  name: string;
  submittedBy: string;
  twitterHandle: string | null;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

export type ResourceData = PlaylistResource | BenchmarkResource | SoundResource;

export interface EnhancedLike {
  id: string;
  resourceType: 'playlist' | 'benchmark' | 'sound';
  resourceId: number;
  createdAt: string;
  resource: ResourceData | null;
}

export const isPlaylistResource = (
  resource: ResourceData
): resource is PlaylistResource => {
  return (
    'shareCode' in resource &&
    'aimtrainer' in resource &&
    !('benchmarkLink' in resource) &&
    !('filePath' in resource)
  );
};

export const isBenchmarkResource = (
  resource: ResourceData
): resource is BenchmarkResource => {
  return 'benchmarkLink' in resource && 'aimtrainer' in resource;
};

export const isSoundResource = (
  resource: ResourceData
): resource is SoundResource => {
  return 'filePath' in resource && 'submittedBy' in resource;
};
