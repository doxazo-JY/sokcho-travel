"use client";

import { useEffect, useState } from "react";
import { tripStartDateISO } from "@/lib/trip-data";

function computeLabel(): string {
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(tripStartDateISO + "T00:00:00");
  const diffDays = Math.round((target.getTime() - todayMid.getTime()) / 86400000);
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-DAY";
  return `D+${-diffDays}`;
}

export default function DDayBadge() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(computeLabel());
  }, []);

  if (!label) return null;

  return (
    <div className="flex items-baseline gap-1.5 rounded-sm border border-sand-line bg-sand-card px-3.5 py-2">
      <span className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">D-Day</span>
      <span className="text-[0.88rem] font-semibold text-sunrise">{label}</span>
    </div>
  );
}
