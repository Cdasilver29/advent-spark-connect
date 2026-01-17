import { useEffect, useState } from "react";

interface PreloadOptions {
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Hook to preload images for better performance
 */
export const useImagePreload = (
  src: string | string[],
  options: PreloadOptions = {}
) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  const { priority = false, onLoad, onError } = options;

  useEffect(() => {
    const sources = Array.isArray(src) ? src : [src];
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      setProgress((loadedCount / sources.length) * 100);
      
      if (loadedCount === sources.length) {
        setLoaded(true);
        onLoad?.();
      }
    };

    const handleError = () => {
      setError(true);
      onError?.();
    };

    sources.forEach((source) => {
      const img = new Image();
      
      if (priority) {
        // @ts-ignore - fetchPriority is a newer property
        img.fetchPriority = "high";
      }
      
      img.src = source;
      img.onload = handleLoad;
      img.onerror = handleError;
      images.push(img);
    });

    return () => {
      // Cleanup
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [src, priority, onLoad, onError]);

  return { loaded, error, progress };
};

/**
 * Preload critical images on page load
 */
export const preloadCriticalImages = (sources: string[]) => {
  sources.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Check if WebP is supported by the browser
 */
export const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
  });
};

export default useImagePreload;
