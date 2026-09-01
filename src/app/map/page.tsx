import { days } from "@/lib/trip-data";
import NaverRouteMap, { type RoutePoint } from "@/components/NaverRouteMap";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20 pt-10">
      <h1 className="m-0 mb-2 font-serif text-2xl font-bold text-sea-deep">동선 지도</h1>
      <p className="m-0 mb-8 text-[0.88rem] text-ink-faint">방문 순서대로 번호가 매겨져 있어요.</p>

      {days.map((day) => {
        const points: RoutePoint[] = day.stops
          .filter((s): s is typeof s & { lat: number; lng: number } => s.lat != null && s.lng != null)
          .map((s, i) => ({ order: i + 1, name: s.name, lat: s.lat, lng: s.lng }));

        return (
          <section key={day.dayNum} className="mt-9 first:mt-0">
            <h2 className="m-0 mb-4 font-mono text-[0.78rem] font-semibold tracking-wide text-sunrise">
              DAY {day.dayNum} · {day.title}
            </h2>
            <div className="h-[380px] w-full">
              <NaverRouteMap points={points} />
            </div>
            <ol className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
              {points.map((p) => (
                <li key={p.order} className="flex items-center gap-1.5 text-[0.82rem] text-ink-soft">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-sea-deep font-mono text-[0.65rem] font-bold text-sand-card">
                    {p.order}
                  </span>
                  {p.name}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
