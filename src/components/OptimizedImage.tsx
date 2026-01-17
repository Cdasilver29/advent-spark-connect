import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "auto";
  priority?: boolean;
  blurPlaceholder?: boolean;
  onLoadComplete?: () => void;
}

// Generate a tiny blurred placeholder color based on image path
const getPlaceholderGradient = (src: string): string => {
  // Create a simple hash from the src to generate consistent colors
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = src.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${hue}, 30%, 85%) 0%, hsl(${(hue + 30) % 360}, 25%, 90%) 100%)`;
};

// Aspect ratio classes
const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  auto: "",
};

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc,
  aspectRatio = "auto",
  priority = false,
  blurPlaceholder = true,
  className,
  onLoadComplete,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // Check if the image supports WebP version
  const getWebPSrc = (imageSrc: string): string | null => {
    // For Supabase storage URLs, we can't convert to WebP
    if (imageSrc.includes('supabase.co')) {
      return null;
    }
    
    // For local assets that might have WebP versions
    const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    if (webpSrc !== imageSrc) {
      return webpSrc;
    }
    
    return null;
  };

  const webpSrc = getWebPSrc(currentSrc);
  const placeholderGradient = getPlaceholderGradient(src);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Blur placeholder */}
      {blurPlaceholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 animate-pulse transition-opacity duration-500"
          style={{ background: placeholderGradient }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-muted-foreground text-sm text-center p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Image unavailable
          </div>
        </div>
      )}

      {/* Actual image with picture element for WebP support */}
      {isInView && !hasError && (
        <picture>
          {webpSrc && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
