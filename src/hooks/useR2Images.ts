import { useState, useEffect } from 'react';

interface ImageUrlCache {
  [key: string]: {
    url: string;
    expiresAt: number;
  };
}

export function useR2Images(imageKeys: string[]) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<ImageUrlCache>({});

  useEffect(() => {
    if (imageKeys.length === 0) {
      setImageUrls({});
      return;
    }

    const fetchImageUrls = async () => {
      setLoading(true);
      setError(null);
      
      const newUrls: { [key: string]: string } = {};
      const urlsToFetch: string[] = [];

      for (const key of imageKeys) {
        const cached = cache[key];
        if (cached && cached.expiresAt > Date.now()) {
          newUrls[key] = cached.url;
          console.log(`Using cached URL for: ${key}`);
        } else {
          urlsToFetch.push(key);
        }
      }

      if (urlsToFetch.length > 0) {
        console.log(`🔄 Fetching presigned URLs for ${urlsToFetch.length} images`);
        
        try {
          const promises = urlsToFetch.map(async (key) => {
            const response = await fetch('/api/image-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageKey: key }),
            });

            const result = await response.json();
            
            if (result.url) {
              return { key, url: result.url };
            } else {
              console.error(`Failed to get URL for ${key}:`, result.error);
              return { key, url: null };
            }
          });

          const results = await Promise.all(promises);
          
          const newCacheEntries: ImageUrlCache = {};
          
          results.forEach(({ key, url }) => {
            if (url) {
              newUrls[key] = url;
              newCacheEntries[key] = {
                url,
                expiresAt: Date.now() + (50 * 60 * 1000)
              };
            }
          });

          setCache(prev => ({ ...prev, ...newCacheEntries }));
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch image URLs');
          console.error('Error fetching image URLs:', err);
        }
      }

      setImageUrls(newUrls);
      setLoading(false);
    };

    fetchImageUrls();
  }, [imageKeys, cache]);

  return { imageUrls, loading, error };
}