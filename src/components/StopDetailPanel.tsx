import type { Stop } from "@/lib/trip-data";
import { tmapUrl, photosFor } from "@/lib/trip-data";
import PhotoCarousel from "./PhotoCarousel";

export default function StopDetailPanel({
  stop,
  onClose,
}: {
  stop: Stop;
  onClose?: () => void;
}) {
  const photos = photosFor(stop.photoPlace);

  return (
    <div className="mt-3 rounded-sm border border-sand-line bg-sand-card px-5 py-4">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        {stop.time && (
          <span className="font-mono text-[0.8rem] font-semibold tabular-nums text-sea-mid">
            {stop.time}
          </span>
        )}
        <p className="m-0 flex-1 text-[1rem] font-bold text-ink">{stop.name}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="ml-auto rounded p-1 text-ink-faint hover:bg-sand-line hover:text-ink"
          >
            ✕
          </button>
        )}
      </div>

      {stop.desc && <p className="m-0 max-w-[58ch] text-[0.9rem] text-ink-soft">{stop.desc}</p>}
      {stop.note && (
        <span className="mt-1.5 inline-block border-l-2 border-sand-line pl-2.5 text-[0.8rem] text-ink-faint">
          {stop.note}
        </span>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {stop.links?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-sand-line bg-sea-mid-soft px-2.5 py-0.5 text-[0.76rem] font-bold text-sea-deep no-underline hover:bg-sand-line after:content-['↗'] after:text-[0.75em]"
          >
            {link.label}
          </a>
        ))}
        {stop.mapQuery && (
          <a
            href={tmapUrl(stop)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-sand-line bg-sea-mid-soft px-2.5 py-0.5 text-[0.76rem] font-bold text-sea-deep no-underline hover:bg-sand-line after:content-['↗'] after:text-[0.75em]"
          >
            길찾기
          </a>
        )}
      </div>

      <PhotoCarousel photos={photos} />
    </div>
  );
}
