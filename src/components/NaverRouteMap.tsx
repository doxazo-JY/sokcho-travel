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
const SELECTED_ZOOM = 15; // 축척 약 300m
const MY_LOCATION_COLOR = "#3b82f6";

function createMyLocationPuck() {
  const puck = document.createElement("div");
  puck.style.position = "relative";
  puck.style.width = "22px";
  puck.style.height = "22px";
  puck.innerHTML = `
    <div style="position:absolute;inset:0;border-radius:50%;background:${MY_LOCATION_COLOR};border:2px solid #fff;box-shadow:0 1px 4px rgba(74,56,48,0.4);"></div>
    <div style="position:absolute;left:50%;top:-8px;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:8px solid ${MY_LOCATION_COLOR};"></div>
  `;
  return puck;
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const positionsRef = useRef<Map<string, any>>(new Map());
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const watchIdRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myMarkerRef = useRef<any>(null);
  const myPuckElRef = useRef<HTMLDivElement | null>(null);
  const orientationHandlerRef = useRef<((e: Event) => void) | null>(null);
  const orientationEventRef = useRef<string | null>(null);
  const hasCenteredOnMeRef = useRef(false);

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

      // 같은 좌표(예: 호텔 체크인과 그 안 수영장)는 마커가 완전히 겹쳐 하나만 보이므로,
      // 좌표별로 묶어서 번호를 합친 마커 하나로 표시하고 클릭할 때마다 그 안의 지점을
      // 번갈아 선택한다.
      const groups = new Map<string, RoutePoint[]>();
      for (const p of points) {
        const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
        const list = groups.get(key) ?? [];
        list.push(p);
        groups.set(key, list);
      }

      for (const group of groups.values()) {
        const label = group.map((p) => p.order).join("·");
        const pinEl = document.createElement("div");
        pinEl.title = group.map((p) => p.name).join(" · ");
        pinEl.style.cursor = "pointer";
        Object.assign(pinEl.style, {
          minWidth: "26px",
          height: "26px",
          padding: "0 4px",
          borderRadius: "13px",
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
        pinEl.textContent = label;
        const first = group[0];
        const position = new naver.maps.LatLng(first.lat, first.lng);
        for (const p of group) {
          pinElsRef.current.set(p.id, pinEl);
          positionsRef.current.set(p.id, position);
        }

        const marker = new naver.maps.Marker({
          position,
          map,
          icon: {
            content: pinEl,
            size: new naver.maps.Size(26, 26),
            anchor: new naver.maps.Point(13, 13),
          },
          zIndex: 10,
        });
        naver.maps.Event.addListener(marker, "click", () => {
          const ids = group.map((p) => p.id);
          const currentIndex = ids.indexOf(selectedIdRef.current ?? "");
          const next = ids[(currentIndex + 1) % ids.length];
          onSelectRef.current?.(next);
        });
      }

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

  function stopTracking() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (orientationHandlerRef.current && orientationEventRef.current) {
      window.removeEventListener(orientationEventRef.current, orientationHandlerRef.current);
      orientationHandlerRef.current = null;
      orientationEventRef.current = null;
    }
    if (myMarkerRef.current) {
      myMarkerRef.current.setMap(null);
      myMarkerRef.current = null;
    }
    myPuckElRef.current = null;
    hasCenteredOnMeRef.current = false;
  }

  async function startTracking() {
    if (!navigator.geolocation) return;

    // iOS(Safari)는 방향 센서 권한을 사용자 제스처 안에서만 물어볼 수 있어서, 버튼 없이
    // 자동 시작하는 지금 흐름에서는 대부분 조용히 실패한다 — 위치 점 자체는 뜨지만
    // 나침반 회전은 안 될 수 있다는 뜻. 큰 문제는 아니라 그대로 시도만 해본다.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = (window as any).DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") {
      try {
        await DOE.requestPermission();
      } catch {
        // 거부돼도 위치 표시 자체는 계속 진행
      }
    }

    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOrientation = (e: any) => {
      let heading: number | null = null;
      if (typeof e.webkitCompassHeading === "number") {
        heading = e.webkitCompassHeading;
      } else if (typeof e.alpha === "number") {
        heading = 360 - e.alpha;
      }
      if (heading != null && myPuckElRef.current) {
        myPuckElRef.current.style.transform = `rotate(${heading}deg)`;
      }
    };
    window.addEventListener(eventName, onOrientation);
    orientationHandlerRef.current = onOrientation;
    orientationEventRef.current = eventName;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const naver = window.naver;
        const map = mapInstanceRef.current;
        if (!naver || !map) return;
        const position = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        if (!myMarkerRef.current) {
          const puck = createMyLocationPuck();
          myPuckElRef.current = puck;
          myMarkerRef.current = new naver.maps.Marker({
            position,
            map,
            icon: { content: puck, size: new naver.maps.Size(22, 22), anchor: new naver.maps.Point(11, 11) },
            zIndex: 200,
          });
        } else {
          myMarkerRef.current.setPosition(position);
        }

        if (!hasCenteredOnMeRef.current) {
          hasCenteredOnMeRef.current = true;
          map.morph(position, SELECTED_ZOOM);
        }
      },
      () => {
        // 위치 권한이 없거나 거부된 경우. 버튼이 없으니 조용히 무시 — 다음 로드 때
        // 브라우저가 권한을 기억하고 있다면 자동으로 다시 시도된다.
        stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 1000 },
    );
  }

  useEffect(() => {
    if (status !== "ready") return;
    startTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    return () => stopTracking();
  }, []);

  useEffect(() => {
    // 좌표가 겹치는 지점들은 같은 DOM 엘리먼트를 공유해서, id별로 따로 스타일을 매기면
    // 그중 마지막에 처리된 id가 항상 이전 결과를 덮어써버린다 — 엘리먼트 단위로 한 번씩만
    // 처리해서, 그 엘리먼트가 대표하는 id들 중 하나라도 선택됐으면 강조되게 한다.
    const idsByEl = new Map<HTMLDivElement, string[]>();
    for (const [id, pinEl] of pinElsRef.current) {
      const list = idsByEl.get(pinEl) ?? [];
      list.push(id);
      idsByEl.set(pinEl, list);
    }
    for (const [pinEl, ids] of idsByEl) {
      const isSelected = selectedId != null && ids.includes(selectedId);
      pinEl.style.outline = isSelected ? "2px solid #4a3830" : "none";
      pinEl.style.outlineOffset = isSelected ? "1px" : "0";
      pinEl.style.transform = isSelected ? "scale(1.15)" : "scale(1)";
    }

    const map = mapInstanceRef.current;
    const position = selectedId != null ? positionsRef.current.get(selectedId) : undefined;
    if (map && position) map.morph(position, SELECTED_ZOOM);
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
