"use client";

import { useState } from "react";
import Image from "next/image";

export default function PhotoCarousel({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  return (
    <div className="relative mt-2.5 w-full max-w-[420px] aspect-[4/3] overflow-hidden rounded-sm border border-sand-line bg-sand-card">
      <Image
        src={photos[index]}
        alt=""
        fill
        sizes="420px"
        className="object-cover"
        priority={index === 0}
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 사진"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-sand-line bg-sand-card/85 text-sea-deep text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-sea-deep"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 사진"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-sand-line bg-sand-card/85 text-sea-deep text-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-sea-deep"
          >
            ›
          </button>
          <span className="absolute bottom-2 right-2 rounded-sm border border-sand-line bg-sand-card/85 px-1.5 py-0.5 font-mono text-[0.68rem] text-ink">
            {index + 1}/{photos.length}
          </span>
        </>
      )}
    </div>
  );
}
