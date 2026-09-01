"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "일정" },
  { href: "/map", label: "지도" },
  { href: "/prep", label: "준비" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-sand-line bg-sand/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[760px] gap-1 px-5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`border-b-2 px-3 py-3 text-[0.88rem] font-semibold no-underline transition-colors ${
                active
                  ? "border-sea-deep text-sea-deep"
                  : "border-transparent text-ink-faint hover:text-ink-soft"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
