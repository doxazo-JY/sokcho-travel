"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverMaps } from "@/lib/naver-loader";

export type RoutePoint = {
  order: number;
  name: string;
  lat: number;
  lng: number;
};

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const MARKER_COLOR = "#a8734d"; // --sea-deep
const LINE_COLOR = "#d5b097"; // --sunrise / --sea-mid

export default function NaverRouteMap({ points }: { points: RoutePoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    NAVER_MAP_CLIENT_ID ? "loading" : "error",
  );
  const mapCreatedRef = useRef(false);

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID) return;
    let cancelled = false;

    function initMap() {
      if (cancelled || !containerRef.current || mapCreatedRef.current) return;
      mapCreatedRef.current = true;

      const naver = window.naver;
      const map = new naver.maps.Map(containerRef.current, {
        center: new naver.maps.LatLng(points[0].lat, points[0].lng),
        zoom: 12,
      });

      const bounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(points[0].lat, points[0].lng),
        new naver.maps.LatLng(points[0].lat, points[0].lng),
      );

      const path = points.map((p) => {
        const pos = new naver.maps.LatLng(p.lat, p.lng);
        bounds.extend(pos);
        return pos;
      });

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

        new naver.maps.Marker({
          position: new naver.maps.LatLng(p.lat, p.lng),
          map,
          icon: {
            content: pinEl,
            size: new naver.maps.Size(26, 26),
            anchor: new naver.maps.Point(13, 13),
          },
          clickable: false,
          zIndex: 10,
        });
      });

      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
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
