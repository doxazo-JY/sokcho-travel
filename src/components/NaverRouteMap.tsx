"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverMaps } from "@/lib/naver-loader";

export type RoutePoint = {
  id: string;
  order: number;
  name: string;
  lat: number;
  lng: number;
  /** false면 마커·선에는 표시되지만 지도 확대 범위 계산에서는 제외됨(예: 멀리 있는 집) */
  boundsAnchor?: boolean;
};

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const MARKER_COLOR = "#a8734d"; // --sea-deep
const LINE_COLOR = "#d5b097"; // --sunrise / --sea-mid

export default function NaverRouteMap({
  points,
  selectedId,
  onSelect,
}: {
  points: RoutePoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    NAVER_MAP_CLIENT_ID && points.length > 0 ? "loading" : "error",
  );
  const mapCreatedRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundsRef = useRef<any>(null);
  const pinElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID || points.length === 0) return;
    let cancelled = false;

    function initMap() {
      if (cancelled || !containerRef.current || mapCreatedRef.current) return;
      mapCreatedRef.current = true;

      const naver = window.naver;
      const anchorPoints = points.filter((p) => p.boundsAnchor !== false);
      const anchor = anchorPoints[0] ?? points[0];
      const map = new naver.maps.Map(containerRef.current, {
        center: new naver.maps.LatLng(anchor.lat, anchor.lng),
        zoom: 12,
      });
      mapInstanceRef.current = map;

      // 집처럼 멀리 있는 지점은 선으로는 이어주되(동선이 끊겨 보이지 않게), 확대 범위
      // 계산에는 넣지 않는다 — 넣으면 속초 시내에 몰려있는 정류지들끼리 겹쳐 안 보일
      // 만큼 지도가 확 줌아웃된다.
      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(anchor.lat, anchor.lng),
        new naver.maps.LatLng(anchor.lat, anchor.lng),
      );
      const path = points.map((p) => {
        const pos = new naver.maps.LatLng(p.lat, p.lng);
        if (p.boundsAnchor !== false) bounds.extend(pos);
        return pos;
      });
      boundsRef.current = bounds;

      new naver.maps.Polyline({
        map,
        path,
        strokeColor: LINE_COLOR,
        strokeWeight: 3,
        strokeOpacity: 0.8,
        strokeStyle: "shortdash",
      });

      points.forEach((p) => {
        const pinEl = document.createElement("div");
        pinEl.title = p.name;
        pinEl.style.cursor = "pointer";
        Object.assign(pinEl.style, {
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          border: "2px solid #fcfbf4",
          background: MARKER_COLOR,
          boxShadow: "0 1px 4px rgba(74,56,48,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#fcfbf4",
          fontFamily: "IBM Plex Mono, monospace",
        });
        pinEl.textContent = String(p.order);
        pinElsRef.current.set(p.id, pinEl);

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(p.lat, p.lng),
          map,
          icon: {
            content: pinEl,
            size: new naver.maps.Size(26, 26),
            anchor: new naver.maps.Point(13, 13),
          },
          zIndex: 10,
        });
        naver.maps.Event.addListener(marker, "click", () => onSelectRef.current?.(p.id));
      });

      map.fitBounds(bounds);
      setStatus("ready");
    }

    loadNaverMaps()
      .then(initMap)
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [points]);

  // 네이버 지도는 컨테이너 크기가 늦게 확정돼도 스스로 다시 그리지 않는다. 지도 생성
  // 시점에 컨테이너 너비가 아직 0이면 fitBounds가 줌을 최소값으로 계산해버리는데,
  // autoResize()만으로는 그 잘못된 줌이 저절로 재계산되지 않는다 — 컨테이너가 실제
  // 크기를 갖게 된 직후 fitBounds를 한 번 더 불러서 바로잡는다.
  const hasRefitRef = useRef(false);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const map = mapInstanceRef.current;
      if (!map) return;
      map.autoResize();
      const width = entries[0]?.contentRect.width ?? 0;
      if (!hasRefitRef.current && width > 0 && boundsRef.current) {
        hasRefitRef.current = true;
        map.fitBounds(boundsRef.current);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    for (const [id, pinEl] of pinElsRef.current) {
      const isSelected = id === selectedId;
      pinEl.style.outline = isSelected ? "2px solid #4a3830" : "none";
      pinEl.style.outlineOffset = isSelected ? "1px" : "0";
      pinEl.style.transform = isSelected ? "scale(1.15)" : "scale(1)";
    }
  }, [selectedId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm border border-sand-line">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand-card text-[0.85rem] text-ink-faint">
          지도를 불러오는 중...
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand-card px-6 text-center text-[0.85rem] text-ink-faint">
          지도를 불러오지 못했어요. API 키/도메인 등록을 확인해주세요.
        </div>
      )}
    </div>
  );
}
