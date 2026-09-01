import type { Day } from "@/lib/trip-data";
import StopBlock from "./StopBlock";

export default function DaySection({ day }: { day: Day }) {
  return (
    <div className="mt-13">
      <div className="mb-1 flex items-baseline gap-3.5">
        <span className="font-mono text-[0.78rem] font-semibold tracking-wide text-sunrise">
          DAY {day.dayNum}
        </span>
        <h2 className="m-0 text-balance font-serif text-[1.55rem] font-bold text-sea-deep">
          {day.title}
        </h2>
      </div>
      <p className="mt-1.5 mb-6.5 text-[0.85rem] text-ink-faint">{day.date}</p>

      <div className="relative border-l-2 border-sand-line pl-6.5 max-[480px]:pl-5">
        {day.stops.map((stop, i) => (
          <StopBlock key={i} stop={stop} />
        ))}
      </div>
    </div>
  );
}
