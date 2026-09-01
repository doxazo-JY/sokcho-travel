"use client";

import { useState } from "react";
import { days, homePoint, naverMapUrl } from "@/lib/trip-data";
import NaverRouteMap, { type RoutePoint } from "@/components/NaverRouteMap";
import StopDetailPanel from "@/components/StopDetailPanel";

function dayPoints(dayIndex: number): RoutePoint[] {
  const day = days[dayIndex];
  const stopPoints: RoutePoint[] = day.stops
    .filter((s): s is typeof s & { lat: number; lng: number } => s.lat != null && s.lng != null)
    .map((s, i) => ({ id: s.name, kind: "stop", order: i + 1, name: s.name, lat: s.lat, lng: s.lng }));

  const home: RoutePoint = { id: "home", kind: "home", name: homePoint.name, lat: homePoint.lat, lng: homePoint.lng };
  return dayIndex === 0 ? [home, ...stopPoints] : [...stopPoints, home];
}

export default function MapPage() {
  const [selected, setSelected] = useState<Record<number, string | null>>({});

  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20 pt-10">
      <h1 className="m-0 mb-2 font-serif text-2xl font-bold text-sea-deep">동선 지도</h1>
      <p className="m-0 mb-8 text-[0.88rem] text-ink-faint">
        방문 순서대로 번호가 매겨져 있어요. 마커를 누르면 상세 정보가 떠요.
      </p>

      {days.map((day, dayIndex) => {
        const points = dayPoints(dayIndex);
        const selectedId = selected[day.dayNum] ?? null;
        const selectedStop = day.stops.find((s) => s.name === selectedId);
        const isHomeSelected = selectedId === "home";

        return (
          <section key={day.dayNum} className="mt-9 first:mt-0">
            <h2 className="m-0 mb-4 font-mono text-[0.78rem] font-semibold tracking-wide text-sunrise">
              DAY {day.dayNum} · {day.title}
            </h2>
            <div className="h-[380px] w-full">
              <NaverRouteMap
                points={points}
                selectedId={selectedId}
                onSelect={(id) => setSelected((prev) => ({ ...prev, [day.dayNum]: id }))}
              />
            </div>
            <ol className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
              {points
                .filter((p) => p.kind === "stop")
                .map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelected((prev) => ({ ...prev, [day.dayNum]: p.id }))}
                      className={`flex items-center gap-1.5 rounded px-1 py-0.5 text-[0.82rem] ${
                        p.id === selectedId ? "text-ink font-semibold" : "text-ink-soft"
                      }`}
                    >
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-sea-deep font-mono text-[0.65rem] font-bold text-sand-card">
                        {p.order}
                      </span>
                      {p.name}
                    </button>
                  </li>
                ))}
            </ol>

            {selectedStop && <StopDetailPanel stop={selectedStop} />}
            {isHomeSelected && (
              <div className="mt-3 rounded-sm border border-sand-line bg-sand-card px-5 py-4">
                <p className="m-0 mb-1 text-[1rem] font-bold text-ink">{homePoint.name}</p>
                <p className="m-0 text-[0.88rem] text-ink-soft">{homePoint.address}</p>
                <a
                  href={naverMapUrl(homePoint.address)}
                  target="_blank"
                  rel="noopener"
                  className="mt-2.5 inline-flex items-center gap-1 whitespace-nowrap rounded border border-sand-line bg-sea-mid-soft px-2.5 py-0.5 text-[0.76rem] font-bold text-sea-deep no-underline hover:bg-sand-line after:content-['↗'] after:text-[0.75em]"
                >
                  길찾기
                </a>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
