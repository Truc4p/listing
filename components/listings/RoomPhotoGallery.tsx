"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoomImage } from "@/types";

interface RoomPhotoGalleryProps {
  images: RoomImage[];
  roomTitle: string;
}

function GalleryImage({ image, alt, className }: { image: RoomImage; alt: string; className?: string }) {
  if (image.url.startsWith("/api/blob?")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image.url} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <Image
      src={image.url}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, 80vw"
    />
  );
}

export function RoomPhotoGallery({ images, roomTitle }: RoomPhotoGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openGallery = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeGallery = useCallback(() => setIsOpen(false), []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGallery, goToNext, goToPrevious, isOpen]);

  if (images.length === 0) return null;

  const mainImage = images[0];
  const thumbs = images.slice(1, 5);
  const activeImage = images[activeIndex];

  return (
    <>
      <div className="relative mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-105 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="col-span-2 row-span-2 relative bg-gray-100 overflow-hidden cursor-pointer group text-left"
            aria-label="Open photo 1"
          >
            <GalleryImage image={mainImage} alt={mainImage.alt ?? roomTitle} />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>

          {thumbs.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => openGallery(index + 1)}
              className="relative bg-gray-100 overflow-hidden cursor-pointer group text-left"
              aria-label={`Open photo ${index + 2}`}
            >
              <GalleryImage image={image} alt={image.alt ?? `${roomTitle} – photo ${index + 2}`} />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}

          {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-100" />
          ))}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-900 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Grid2x2 className="w-4 h-4" />
            Show all {images.length} photos
          </button>
        )}
      </div>

      {isOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`${roomTitle} photo gallery`}
        >
          <div className="absolute left-4 top-4 right-4 z-10 flex items-center justify-between gap-4">
            <div className="text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </div>
            <button
              type="button"
              onClick={closeGallery}
              className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
              aria-label="Close photo gallery"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex h-full items-center justify-center px-4 py-20 sm:px-16">
            <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
              <GalleryImage
                image={activeImage}
                alt={activeImage.alt ?? `${roomTitle} – photo ${activeIndex + 1}`}
                className="object-contain"
              />
            </div>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors sm:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors sm:right-6"
                aria-label="Next photo"
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl bg-black/50 p-2">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-thumb-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-800 transition-colors",
                      index === activeIndex ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <GalleryImage image={image} alt={image.alt ?? `${roomTitle} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
