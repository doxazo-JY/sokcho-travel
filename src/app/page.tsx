import { days, meta, routeOverview, tips, tipLinks } from "@/lib/trip-data";
import DaySection from "@/components/DaySection";
import DDayBadge from "@/components/DDayBadge";

export default function Home() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20">
      <header className="border-b border-sand-line py-9 pt-14">
        <p className="m-0 mb-3.5 font-mono text-[0.72rem] font-semibold uppercase tracking-widest text-sea-mid">
          {meta.eyebrow}
        </p>
        <h1 className="m-0 mb-2.5 text-balance font-serif text-[clamp(2rem,5vw,2.7rem)] font-bold tracking-tight text-sea-deep">
          {meta.title}
        </h1>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <DDayBadge />
          <MetaChip k="Date" v={meta.dateRange} />
          <MetaChip k="Move" v={meta.move} />
          <MetaChip k="Stay" v={meta.stay} />
        </div>
      </header>

      <section className="pt-7.5 pb-2">
        <h2 className="m-0 mb-3.5 font-serif text-[1.05rem] font-bold text-sea-deep">
          한눈에 보는 동선
        </h2>
        {routeOverview.map((route) => (
          <div key={route.dayLabel} className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.86rem] first:mt-0">
            <span className="mr-1 font-mono text-[0.68rem] font-bold tracking-wide text-sea-mid">
              {route.dayLabel}
            </span>
            {route.stops.map((s, i) => (
              <span key={i} className="contents">
                <span
                  className={`whitespace-nowrap font-bold ${
                    s.tbd
                      ? "border-b border-dashed border-ink-faint font-medium text-ink-faint"
                      : s.stay
                        ? "text-sunrise"
                        : "text-sea-deep"
                  }`}
                >
                  {s.label}
                </span>
                {i < route.stops.length - 1 && <span className="text-[0.8rem] text-ink-faint">→</span>}
              </span>
            ))}
          </div>
        ))}
      </section>

      {days.map((day) => (
        <DaySection key={day.dayNum} day={day} />
      ))}

      <section className="mt-15 rounded-sm border border-sand-line border-t-2 border-t-sea-mid bg-sand-card px-6.5 py-7">
        <h2 className="m-0 mb-4 font-serif text-[1.2rem] text-sea-deep">여행 메모</h2>
        <ul className="m-0 grid list-none gap-3 p-0">
          {tips.map((tip, i) => (
            <li
              key={i}
              className="relative pl-5 text-[0.9rem] text-ink-soft before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-sea-mid before:content-['']"
              dangerouslySetInnerHTML={{ __html: tip.html }}
            />
          ))}
          <li className="relative pl-5 text-[0.9rem] text-ink-soft before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-sea-mid before:content-['']">
            <strong className="font-semibold text-ink">식당 추천 영상</strong>
            <div className="mt-2 flex flex-col items-start gap-1.5">
              {tipLinks.map((link) => (
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
            </div>
          </li>
        </ul>
      </section>

      <footer className="mt-10 text-center text-[0.78rem] text-ink-faint">{meta.footer}</footer>
    </div>
  );
}

function MetaChip({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-1.5 rounded-sm border border-sand-line bg-sand-card px-3.5 py-2">
      <span className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">{k}</span>
      <span className="text-[0.88rem] font-semibold text-ink">{v}</span>
    </div>
  );
}
