import { useState, useMemo } from 'react';
import { Playlist } from '@/types/playlist';

type SortField = 'name' | 'likes' | 'author' | 'aimtrainer' | null;
type SortDirection = 'asc' | 'desc';

export function usePlaylistSort(playlists: Playlist[]) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPlaylists = useMemo(() => {
    if (!sortField) return playlists;

    return [...playlists].sort((a, b) => {
      let valueA: string | number = a[sortField];
      let valueB: string | number = b[sortField];

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [playlists, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;

    if (field === 'likes') {
      return sortDirection === 'asc' ? 'sort-amount-up' : 'sort-amount-down';
    }

    return sortDirection === 'asc' ? 'sort-alpha-down' : 'sort-alpha-up';
  };

  return {
    sortField,
    sortDirection,
    sortedPlaylists,
    handleSort,
    getSortIcon,
  };
}
