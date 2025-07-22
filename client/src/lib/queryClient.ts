import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { offlineStorage } from "./offlineStorage";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

// Offline-aware query function
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache successful API responses for offline use
      if (res.ok && url.includes('/api/')) {
        const cacheKey = url.replace('/api/', '');
        offlineStorage.cacheAppData(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      // If network fails, try to get cached data for API requests
      if (url.includes('/api/')) {
        const cacheKey = url.replace('/api/', '');
        const cachedData = offlineStorage.getCachedAppData(cacheKey);
        
        if (cachedData) {
          console.log(`Serving cached data for ${url}`);
          return cachedData;
        }
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (gcTime replaces cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry if offline - rely on cached data instead
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations if offline
        if (!navigator.onLine) return false;
        return failureCount < 1;
      },
    },
  },
});
