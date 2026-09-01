import { emergencyContacts, naverMapUrl, packingChecklist, tbdItems } from "@/lib/trip-data";
import Checklist from "@/components/Checklist";
import DDayBadge from "@/components/DDayBadge";

export default function PrepPage() {
  const research = tbdItems();

  return (
    <div className="mx-auto max-w-[760px] px-5 pb-20 pt-10">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="m-0 font-serif text-2xl font-bold text-sea-deep">여행 준비</h1>
        <DDayBadge />
      </div>

      <section className="mb-9">
        <h2 className="m-0 mb-3 font-serif text-[1.1rem] font-bold text-sea-deep">긴급 연락처</h2>
        <div className="flex flex-col gap-2">
          {emergencyContacts.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between gap-3 rounded-sm border border-sand-line bg-sand-card px-4 py-2.5"
            >
              <div>
                <p className="m-0 text-[0.9rem] font-bold text-ink">{c.label}</p>
                <p className="m-0 font-mono text-[0.86rem] tabular-nums text-ink-soft">{c.value}</p>
              </div>
              {c.mapQuery && (
                <a
                  href={naverMapUrl(c.mapQuery)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded border border-sand-line bg-sea-mid-soft px-2.5 py-0.5 text-[0.76rem] font-bold text-sea-deep no-underline hover:bg-sand-line after:content-['↗'] after:text-[0.75em]"
                >
                  길찾기
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-9">
        <h2 className="m-0 mb-3 font-serif text-[1.1rem] font-bold text-sea-deep">짐 체크리스트</h2>
        <p className="m-0 mb-3 text-[0.84rem] text-ink-faint">
          이 기기에만 저장돼요 — 각자 폰에서 따로 체크하면 돼요.
        </p>
        <Checklist
          storageKey="sokcho-packing"
          baseItems={packingChecklist.map((label, i) => ({ id: `pack-${i}`, label }))}
          allowAdd
        />
      </section>

      <section>
        <h2 className="m-0 mb-3 font-serif text-[1.1rem] font-bold text-sea-deep">찾아볼 것</h2>
        <p className="m-0 mb-3 text-[0.84rem] text-ink-faint">
          아직 안 정한 일정과, 알아봐야 할 것들. 정해지면 알려주면 일정에 반영할게요.
        </p>
        <Checklist storageKey="sokcho-research" baseItems={research} allowAdd />
      </section>
    </div>
  );
}
