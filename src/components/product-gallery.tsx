"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  mainImage: string | null;
  images: string[];
  name: string;
  isExclusive: boolean;
}

export function ProductGallery({ mainImage, images, name, isExclusive }: ProductGalleryProps) {
  // Combine main image + gallery images, deduplicating
  const allImages = [mainImage, ...images].filter((url): url is string => !!url);
  const uniqueImages = [...new Set(allImages)];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = uniqueImages[selectedIndex] ?? null;

  if (uniqueImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-muted">No image</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white img-hover-zoom rounded-lg shadow-lg">
        <Image
          src={selectedImage!}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded ${
            isExclusive ? "bg-white text-black" : "bg-black/70 text-white"
          }`}>
            {isExclusive ? "1/1 Exclusive" : "Core"}
          </span>
        </div>
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {uniqueImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {uniqueImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === selectedIndex
                  ? "border-foreground opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={url}
                alt={`${name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
