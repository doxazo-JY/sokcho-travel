import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const plexKr = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "9월의 속초",
  description: "인천 계양구 출발, 9.18–9.19 속초 1박 2일 가족 여행 일정",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${gowunBatang.variable} ${plexKr.variable} ${plexMono.variable}`}
    >
      <body className="font-sans">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
