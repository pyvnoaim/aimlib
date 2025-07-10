// types/resources.ts
export type ResourceType = 'crosshair' | 'playlist' | 'sound' | 'theme';

export interface BaseResource {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  likedByUser: boolean;
}

export interface Crosshair extends BaseResource {
  name: string;
  submittedBy: string;
  filePath: string;
}

export interface Playlist extends BaseResource {
  name: string;
  author: string;
  twitterHandle?: string;
  aimtrainer: string;
  shareCode: string;
  isBenchmark: boolean;
  benchmarkLink?: string;
  profileImageUrl?: string;
}

export interface Sound extends BaseResource {
  name: string;
  submittedBy: string;
  filePath: string;
}

export interface Theme extends BaseResource {
  name: string;
  submittedBy: string;
  filePath: string;
}

export type AnyResource = Crosshair | Playlist | Sound | Theme;
