export type Tag = "move" | "food" | "act" | "view" | "rest" | "tbd";

export type Stop = {
  time?: string;
  tag?: Tag;
  tagLabel?: string;
  price?: string;
  name: string;
  desc?: string;
  note?: string;
  stay?: boolean;
  tbd?: boolean;
  links?: { label: string; href: string }[];
  photoPlace?: string;
  mapQuery?: string;
  lat?: number;
  lng?: number;
};

export type Day = {
  dayNum: number;
  title: string;
  date: string;
  stops: Stop[];
};

const TAG_LABEL: Record<Tag, string> = {
  move: "이동",
  food: "식사",
  act: "액티비티",
  view: "전망",
  rest: "여유",
  tbd: "미정",
};

function stop(s: Omit<Stop, "tagLabel"> & { tag?: Tag; tagLabel?: string }): Stop {
  return { ...s, tagLabel: s.tagLabel ?? (s.tag ? TAG_LABEL[s.tag] : undefined) };
}

export const homePoint = {
  name: "집",
  address: "인천광역시 계양구 효서로 381",
  lat: 37.5293419,
  lng: 126.7370702,
};

export const meta = {
  title: "9월의 속초",
  eyebrow: "Sokcho · 1박 2일",
  dateRange: "9.18(금) – 9.19(토)",
  move: "자가용 · 인천 계양구 출발",
  stay: "속초 아이파크 스위트호텔",
  footer: "속초 아이파크 스위트호텔 · 강원특별자치도 속초시 영금정로1길 19-1 (영랑동)",
};

export const days: Day[] = [
  {
    dayNum: 1,
    title: "새벽부터 야경까지",
    date: "9월 18일 금요일",
    stops: [
      stop({
        time: "06:00",
        tag: "move",
        name: "인천 계양구 출발",
        desc: homePoint.address,
        mapQuery: homePoint.address,
        lat: homePoint.lat,
        lng: homePoint.lng,
      }),
      stop({
        time: "09:00",
        tag: "act",
        name: "설악산 국립공원 · 케이블카(권금성)",
        desc: "편도 5분, 왕복 운행. 권금성 전망대까지 연결됨.",
        note: "현장 매표만 가능(사전 예약 불가) · 기상에 따라 운행 변동됨",
        links: [
          { label: "공식 홈페이지", href: "https://www.sorakcablecar.co.kr/tour" },
          { label: "동영상", href: "https://youtube.com/shorts/YXWRzjLlC_U?si=YuvGM2Lz6DLaTENg" },
        ],
        photoPlace: "cablecar",
        mapQuery: "속초 설악산케이블카",
        lat: 38.1730494,
        lng: 128.489114,
      }),
      stop({ time: "11:00", tag: "tbd", tbd: true, name: "점심" }),
      stop({
        tag: "act",
        name: "보광미니골프장 with 카페 18홀",
        desc: "18홀 라운딩 + 카페. 영랑호반길, 호텔에서 5분 거리.",
        links: [{ label: "동영상", href: "https://www.youtube.com/shorts/5kvA9NOc9yk" }],
        photoPlace: "minigolf",
        mapQuery: "보광미니골프장",
        lat: 38.2140512,
        lng: 128.5848312,
      }),
      stop({
        time: "14:00",
        tag: "rest",
        name: "자유시간",
        desc: "카페·간식 미정 — 정해지면 이 자리에 배치함.",
      }),
      stop({
        time: "15:30",
        tag: "food",
        name: "속초관광수산시장",
        desc: "저녁·간식 구매용. 운영시간 08:00~24:00.",
        photoPlace: "market",
        mapQuery: "속초관광수산시장",
        lat: 38.2039882,
        lng: 128.590598,
      }),
      stop({
        time: "16:30",
        tag: "rest",
        tagLabel: "체크인",
        stay: true,
        name: "속초 아이파크 스위트호텔",
        desc: "영랑동, 등대해수욕장 도보 5분. 짐만 맡기고 바로 이동함.",
        photoPlace: "hotel",
        mapQuery: "속초 아이파크 스위트호텔",
        lat: 38.2134432,
        lng: 128.5967365,
      }),
      stop({
        time: "16:30",
        tag: "view",
        tagLabel: "산책",
        name: "등대해수욕장",
        desc: "호텔 바로 앞 해변.",
        links: [{ label: "동영상", href: "https://www.youtube.com/shorts/ur-CkTaufB4" }],
        photoPlace: "beach",
        mapQuery: "등대해수욕장",
        lat: 38.2154956,
        lng: 128.5952447,
      }),
      stop({ time: "17:30", tag: "food", name: "저녁 · 호텔에서", desc: "시장에서 사온 음식으로 해결." }),
      stop({
        time: "18:00",
        tag: "rest",
        tagLabel: "수영장",
        stay: true,
        name: "루프탑 인피니티 수영장 · 3부",
        desc: "R층(28층) 옥상 야외 수영장.",
        note: "3부제 08–12 · 13–17 · 18–22시, 입장은 마감 30분 전까지 · 패키지 특성상 1회 이용이라 이 세션 사용함",
        photoPlace: "pool",
        lat: 38.2134432,
        lng: 128.5967365,
      }),
      stop({
        time: "20:30",
        tag: "view",
        tagLabel: "전망",
        name: "영금정",
        desc: "등대해수욕장 지나 야경 감상. 체력 되면 진행.",
        links: [{ label: "동영상", href: "https://www.youtube.com/shorts/8-jWToLsc1A" }],
        photoPlace: "yeonggeumjeong",
        mapQuery: "속초 영금정",
        lat: 38.2118394,
        lng: 128.6015298,
      }),
    ],
  },
  {
    dayNum: 2,
    title: "천천히, 집으로",
    date: "9월 19일 토요일",
    stops: [
      stop({ time: "08:00", tag: "rest", tagLabel: "조식", stay: true, name: "아침 식사" }),
      stop({
        time: "09:30",
        tag: "rest",
        tagLabel: "체크아웃",
        name: "체크아웃",
        mapQuery: "속초 아이파크 스위트호텔",
        lat: 38.2134432,
        lng: 128.5967365,
      }),
      stop({
        time: "10:00",
        tag: "act",
        price: "₩19,000~26,000",
        name: "뮤지엄엑스",
        desc: "몰입형 미디어아트와 인터랙티브 기술을 결합한 전시 체험 공간.",
        links: [{ label: "동영상", href: "https://www.youtube.com/shorts/APJR3BAVxCk" }],
        photoPlace: "museumx",
        mapQuery: "뮤지엄엑스",
        lat: 38.2189101,
        lng: 128.5923717,
      }),
      stop({ time: "11:30", tag: "tbd", tbd: true, name: "점심" }),
      stop({ time: "12:30", tag: "tbd", tbd: true, name: "카페" }),
      stop({
        time: "13:30",
        tag: "rest",
        tagLabel: "휴식",
        name: "척산족욕공원",
        desc: "무료 족욕 시설.",
        links: [{ label: "동영상", href: "https://www.youtube.com/shorts/L4rC5i2ln08" }],
        photoPlace: "cheoksan",
        mapQuery: "척산족욕공원",
        lat: 38.1859486,
        lng: 128.5424879,
      }),
      stop({
        time: "14:30",
        tag: "move",
        name: "귀가",
        desc: homePoint.address,
        mapQuery: homePoint.address,
        lat: homePoint.lat,
        lng: homePoint.lng,
      }),
    ],
  },
];

export const routeOverview = [
  {
    dayLabel: "DAY 1",
    stops: [
      { label: "새벽 출발" },
      { label: "설악산 케이블카" },
      { label: "보광미니골프" },
      { label: "수산시장" },
      { label: "호텔 체크인 · 인피니티 풀", stay: true },
      { label: "영금정 야경(옵션)" },
    ],
  },
  {
    dayLabel: "DAY 2",
    stops: [
      { label: "조식 · 체크아웃", stay: true },
      { label: "뮤지엄엑스" },
      { label: "점심 · 카페 미정", tbd: true },
      { label: "척산족욕공원" },
      { label: "귀가" },
    ],
  },
];

export const tips = [
  { html: "<strong>케이블카</strong> — 온라인 예약 없음, 현장 구매만 가능함. 기상 변수 있어 첫날 오전에 배치함." },
  { html: "<strong>수영장</strong> — 08–12 / 13–17 / 18–22시 3부제." },
  { html: "<strong>주차</strong> — 호텔 무료 주차(330대) 가능. 케이블카·시장 등은 별도 주차장 이용." },
  { html: "<strong>식당·카페</strong> — 미정인 자리는 점선으로 표시함. 정해지는 대로 채워 넣기." },
];

export const tipLinks = [{ label: "속초 맛집 추천", href: "https://www.youtube.com/shorts/g8beNfzOuAU" }];

export function naverMapUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

export const PHOTO_COUNTS: Record<string, { count: number; ext: string[] }> = {
  cablecar: { count: 2, ext: ["jpg", "jpg"] },
  minigolf: { count: 3, ext: ["jpg", "jpg", "jpg"] },
  market: { count: 4, ext: ["jpg", "jpg", "jpg", "jpg"] },
  hotel: { count: 2, ext: ["webp", "jpg"] },
  beach: { count: 3, ext: ["jpg", "jpg", "jpg"] },
  pool: { count: 2, ext: ["webp", "jpg"] },
  yeonggeumjeong: { count: 3, ext: ["jpg", "jpg", "jpeg"] },
  museumx: { count: 7, ext: ["jpg", "png", "png", "jpg", "png", "png", "png"] },
  cheoksan: { count: 4, ext: ["jpg", "jpg", "jpg", "jpg"] },
};

export function photosFor(place?: string): string[] {
  if (!place) return [];
  const info = PHOTO_COUNTS[place];
  if (!info) return [];
  return info.ext.map((ext, i) => `/photos/${place}/${i + 1}.${ext}`);
}
