import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Playlist } from '@/types/playlist';

interface FilterOptions {
  searchFields?: (keyof Playlist)[];
  debounceMs?: number;
}

export function usePlaylistFilter(
  playlists: Playlist[],
  options: FilterOptions = {}
) {
  const { searchFields = ['name', 'author'], debounceMs = 300 } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  const filteredPlaylists = useMemo(() => {
    if (!debouncedQuery.trim()) return playlists;

    const query = debouncedQuery.toLowerCase();

    return playlists.filter((playlist) =>
      searchFields.some((field) => {
        const value = playlist[field];
        return typeof value === 'string' && value.toLowerCase().includes(query);
      })
    );
  }, [playlists, debouncedQuery, searchFields]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    filteredPlaylists,
    clearSearch,
    hasActiveFilter: Boolean(debouncedQuery.trim()),
  };
}
