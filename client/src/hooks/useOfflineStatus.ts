import { useState, useEffect } from 'react';

export interface OfflineStatus {
  isOffline: boolean;
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOfflineStatus(): OfflineStatus {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOffline,
    isOnline: !isOffline,
    wasOffline
  };
}

// Custom hook for offline-aware data fetching
export function useOfflineAwareFetch<T>(
  fetcher: () => Promise<T>,
  fallbackData?: T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | undefined>(fallbackData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOffline } = useOfflineStatus();

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      if (isOffline && fallbackData) {
        setData(fallbackData);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await fetcher();
        
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Fetch failed'));
          // Use fallback data if available during error
          if (fallbackData && isOffline) {
            setData(fallbackData);
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [isOffline, ...dependencies]);

  return { data, error, isLoading, isOffline };
}