import { useState, useEffect } from 'react';
import { Playlist } from '@/types/playlist';

export function usePlaylistData() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/playlists');

        if (!response.ok) {
          throw new Error(`Failed to fetch playlists: ${response.statusText}`);
        }

        const data = await response.json();
        setPlaylists(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching playlists:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlaylists();
  }, []);

  const handleLike = (id: string) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              likedByUser: !playlist.likedByUser,
              likes: playlist.likedByUser
                ? playlist.likes - 1
                : playlist.likes + 1,
            }
          : playlist
      )
    );
  };

  const refetch = () => {
    setPlaylists([]);
    setError(null);
    // Trigger useEffect again by changing a dependency
  };

  return {
    playlists,
    isLoading,
    error,
    handleLike,
    refetch,
  };
}
