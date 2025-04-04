
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full">
        {/* Main image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <img
            src={images[activeIndex]}
            alt={`${title} - Image ${activeIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="bg-black/20 text-white hover:bg-black/30 rounded-full h-10 w-10"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="bg-black/20 text-white hover:bg-black/30 rounded-full h-10 w-10"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>

          {/* Fullscreen button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 bg-black/20 text-white hover:bg-black/30 rounded-full h-10 w-10"
          >
            <Maximize className="h-5 w-5" />
            <span className="sr-only">View fullscreen</span>
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/40 text-white text-sm px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-2 mt-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all",
                activeIndex === index
                  ? "border-realty-800 dark:border-realty-gold"
                  : "border-transparent hover:border-realty-400 dark:hover:border-realty-500"
              )}
            >
              <img
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen gallery dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl w-[90vw] p-0 bg-black/95 border-gray-800">
          <div className="relative h-[80vh] flex items-center justify-center">
            <img
              src={images[activeIndex]}
              alt={`${title} - Image ${activeIndex + 1}`}
              className="max-h-full max-w-full"
            />

            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="bg-black/20 text-white hover:bg-black/30 rounded-full h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="bg-black/20 text-white hover:bg-black/30 rounded-full h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex overflow-x-auto gap-2 p-2 bg-black/50">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-20 w-20 flex-shrink-0 rounded overflow-hidden border-2 transition-all",
                  activeIndex === index
                    ? "border-realty-gold"
                    : "border-transparent hover:border-gray-500"
                )}
              >
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyGallery;
