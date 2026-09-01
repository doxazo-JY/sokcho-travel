"use client";

import { useState } from "react";
import { days } from "@/lib/trip-data";
import NaverRouteMap, { type RoutePoint } from "@/components/NaverRouteMap";
import StopDetailPanel from "@/components/StopDetailPanel";

type Period = "am" | "pm";

function periodOf(time: string | undefined, prev: Period): Period {
  if (!time) return prev;
  const hour = Number(time.slice(0, 2));
  return hour < 12 ? "am" : "pm";
}

const HOME_STOP_NAMES = new Set(["인천 계양구 출발", "귀가"]);

function dayPoints(dayIndex: number): (RoutePoint & { period: Period })[] {
  const day = days[dayIndex];
  let prev: Period = "am";
  return day.stops
    .filter((s): s is typeof s & { lat: number; lng: number } => s.lat != null && s.lng != null)
    .map((s, i) => {
      const period = periodOf(s.time, prev);
      prev = period;
      return {
        id: s.name,
        order: i + 1,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        period,
        boundsAnchor: !HOME_STOP_NAMES.has(s.name),
      };
    });
}

const PERIOD_LABEL: Record<Period, string> = { am: "오전", pm: "오후" };

export default function MapPage() {
  const [selected, setSelected] = useState<Record<number, string | null>>({});

  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20 pt-10">
      <h1 className="m-0 mb-2 font-serif text-2xl font-bold text-sea-deep">동선 지도</h1>
      <p className="m-0 mb-8 text-[0.88rem] text-ink-faint">
        집 출발부터 귀가까지, 방문 순서대로 번호가 매겨져 있어요. 마커를 누르면 상세 정보가 떠요.
      </p>

      {days.map((day, dayIndex) => {
        const points = dayPoints(dayIndex);
        const selectedId = selected[day.dayNum] ?? null;
        const selectedStop = day.stops.find((s) => s.name === selectedId);

        const groups: { period: Period; items: typeof points }[] = [];
        for (const p of points) {
          const last = groups[groups.length - 1];
          if (last && last.period === p.period) last.items.push(p);
          else groups.push({ period: p.period, items: [p] });
        }

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
            <div className="mt-3 flex flex-col gap-2">
              {groups.map((group, gi) => (
                <div
                  key={gi}
                  className={gi > 0 ? "border-t border-sand-line pt-2" : undefined}
                >
                  <p className="m-0 mb-1 font-mono text-[0.66rem] font-semibold uppercase tracking-wide text-ink-faint">
                    {PERIOD_LABEL[group.period]}
                  </p>
                  <ol className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
                    {group.items.map((p) => (
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
                </div>
              ))}
            </div>

            {selectedStop && <StopDetailPanel stop={selectedStop} />}
          </section>
        );
      })}
    </div>
  );
}
