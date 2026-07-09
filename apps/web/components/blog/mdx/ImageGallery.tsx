'use client';

import Image from 'next/image';
import { useState } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
};

export default function ImageGallery({
  images,
  caption,
}: {
  images: GalleryImage[];
  caption?: string;
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  // Single image, just show it
  if (images.length === 1) {
    return (
      <figure className="my-8">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="my-8">
      {/* Main image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 720px"
          priority={active === 0}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
              aria-label="Poprzednie zdjęcie"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % images.length)}
              aria-label="Następne zdjęcie"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/40 text-white text-xs font-medium">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Zdjęcie ${i + 1}: ${img.alt}`}
            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              active === i
                ? 'border-indigo-500 opacity-100'
                : 'border-transparent opacity-60 hover:opacity-80'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
