import { useState, useEffect, useCallback, useRef, type TouchEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

const ImageGallery = ({ images, title, subtitle }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    setIsZoomed(false);
  }, [selectedIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    setIsZoomed(false);
  }, [selectedIndex, images.length]);

  // Touch gesture handlers
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (isZoomed) return;
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isZoomed) return;
    touchEndX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = () => {
    if (isZoomed) return;
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          closeLightbox();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <section className="py-16">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ScrollAnimationWrapper
            key={index}
            animation="scaleUp"
            delay={index * 50}
          >
            <div
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-soft hover:shadow-strong transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn className="w-8 h-8 text-white mx-auto mb-2" />
                  {image.title && (
                    <p className="text-white text-sm font-medium px-2">
                      {image.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Image number badge */}
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1} / {images.length}
              </div>
            </div>
          </ScrollAnimationWrapper>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-none overflow-hidden">
          {selectedIndex !== null && (
            <div 
              className="relative w-full h-full flex items-center justify-center touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full w-10 h-10"
                onClick={closeLightbox}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Navigation arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full w-12 h-12"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full w-12 h-12"
                onClick={goToNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Main Image */}
              <div 
                className={`relative transition-all duration-300 ${
                  isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-scale-in"
                />
              </div>

              {/* Image info footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div>
                    {images[selectedIndex].title && (
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {images[selectedIndex].title}
                      </h4>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {images[selectedIndex].alt}
                    </p>
                  </div>
                  
                  {/* Thumbnail strip */}
                  <div className="hidden md:flex items-center gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          idx === selectedIndex
                            ? "border-primary scale-110"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(idx);
                          setIsZoomed(false);
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mt-4 gap-1">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === selectedIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(idx);
                        setIsZoomed(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ImageGallery;
