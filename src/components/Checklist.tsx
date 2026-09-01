"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export default function Checklist({
  storageKey,
  baseItems,
  allowAdd = false,
}: {
  storageKey: string;
  baseItems: Item[];
  allowAdd?: boolean;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<Item[]>([]);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const rawChecked = localStorage.getItem(`${storageKey}:checked`);
      if (rawChecked) setChecked(JSON.parse(rawChecked));
      const rawCustom = localStorage.getItem(`${storageKey}:custom`);
      if (rawCustom) setCustomItems(JSON.parse(rawCustom));
    } catch {
      // localStorage 접근 불가(프라이빗 모드 등) — 빈 상태로 진행
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(`${storageKey}:checked`, JSON.stringify(checked));
    } catch {
      // 저장 실패는 무시 — 이 세션 동안만 상태 유지
    }
  }, [checked, loaded, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(`${storageKey}:custom`, JSON.stringify(customItems));
    } catch {
      // 저장 실패는 무시
    }
  }, [customItems, loaded, storageKey]);

  const items = [...baseItems, ...customItems];

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addCustom() {
    const label = draft.trim();
    if (!label) return;
    setCustomItems((prev) => [...prev, { id: `custom-${Date.now()}`, label }]);
    setDraft("");
  }

  return (
    <div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-2.5 text-[0.9rem]">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="h-4 w-4 shrink-0 accent-sea-deep"
              />
              <span className={checked[item.id] ? "text-ink-faint line-through" : "text-ink"}>
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {allowAdd && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustom();
            }}
            placeholder="추가할 항목"
            className="min-w-0 flex-1 rounded-sm border border-sand-line bg-sand-card px-3 py-1.5 text-[0.86rem] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-sea-mid"
          />
          <button
            type="button"
            onClick={addCustom}
            className="shrink-0 rounded-sm border border-sand-line bg-sea-mid-soft px-3 py-1.5 text-[0.82rem] font-bold text-sea-deep hover:bg-sand-line"
          >
            추가
          </button>
        </div>
      )}
    </div>
  );
}
