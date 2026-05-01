import { type ReactNode } from "react";

export function StepCard({
  accent,
  body,
  demo,
  number,
  title,
}: {
  accent: string;
  body: string;
  demo: ReactNode;
  number: string;
  title: string;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[6px_6px_0_#0A0A0A]">
      <header
        className="flex items-center justify-between border-b-2 border-black px-6 py-5"
        style={{ backgroundColor: accent }}
      >
        <span className="font-mono text-sm font-black uppercase tracking-wide">
          Step {number}
        </span>
        <span className="h-6 w-6 rounded-full bg-black" aria-hidden="true" />
      </header>
      <div className="flex flex-col px-6 pt-6 gap-4 mb-10">
        <div className="mb-5 flex h-[200px] items-center justify-center">
          {demo}
        </div>
        <div className="flex flex-col h-full justify-center">
          <h3 className="mb-2 text-[28px] font-black uppercase leading-none tracking-[-0.04em]">
            {title}
          </h3>
          <p className="text-[15px] font-medium leading-normal text-text-secondary">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}
