import type { Stop } from "@/lib/trip-data";
import { tmapUrl, photosFor } from "@/lib/trip-data";
import PhotoCarousel from "./PhotoCarousel";

const TAG_DOT_ACTIVE = "before:bg-current";
const TAG_DOT_TBD = "before:bg-transparent before:border before:border-dashed before:border-ink-faint";

export default function StopBlock({ stop }: { stop: Stop }) {
  const photos = photosFor(stop.photoPlace);
  const dotColor = stop.stay ? "bg-sunrise border-sunrise" : "bg-sand border-sea-mid";
  const dotStyle = stop.tbd
    ? "bg-sand border-2 border-dashed border-ink-faint"
    : `border-2 ${dotColor}`;

  return (
    <div className="relative pb-[30px] last:pb-1">
      <span
        className={`absolute -left-[32px] top-1 h-2.5 w-2.5 rounded-full max-[480px]:-left-[26px] ${dotStyle}`}
      />
      <div className={stop.tbd ? "rounded-sm border border-dashed border-sand-line bg-sand-card px-3.5 py-2.5" : undefined}>
        {(stop.time || stop.tagLabel) && (
          <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
            {stop.time && (
              <span className="font-mono text-[0.82rem] font-semibold tabular-nums text-sea-mid">
                {stop.time}
              </span>
            )}
            {stop.tagLabel && (
              <span
                className={`inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wide before:h-1.5 before:w-1.5 before:rounded-full before:content-[''] ${
                  stop.tbd ? `text-ink-faint ${TAG_DOT_TBD}` : `text-ink-soft ${TAG_DOT_ACTIVE}`
                }`}
              >
                {stop.tagLabel}
              </span>
            )}
            {stop.price && (
              <span className="font-mono text-[0.78rem] font-semibold tabular-nums text-sea-mid">
                {stop.price}
              </span>
            )}
          </div>
        )}

        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="m-0 text-[1.05rem] font-bold text-ink">{stop.name}</p>
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
              className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-sea-deep bg-sea-deep px-2.5 py-0.5 text-[0.76rem] font-bold text-sand-card no-underline hover:bg-ink after:content-['↗'] after:text-[0.75em]"
            >
              길찾기
            </a>
          )}
        </div>

        {stop.desc && <p className="m-0 max-w-[58ch] text-[0.92rem] text-ink-soft">{stop.desc}</p>}
        {stop.note && (
          <span className="mt-1.5 inline-block border-l-2 border-sand-line pl-2.5 text-[0.8rem] text-ink-faint">
            {stop.note}
          </span>
        )}

        <PhotoCarousel photos={photos} />
      </div>
    </div>
  );
}
