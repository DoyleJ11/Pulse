export function BracketProgress({
  decided,
  total = 15,
}: {
  decided: number;
  total: number;
}) {
  const progress = (decided / total) * 100;
  return (
    <div className="flex items-center gap-2.5 ml-auto">
      <span className="font-mono uppercase text-[12px] font-bold tracking-widest text-text-primary/60">
        Progress
      </span>
      <div className="w-40 h-2.5 bg-[#FFF9F0] border-2 border-solid border-[#0A0A0A]">
        <div
          className={`h-full bg-[#0A0A0A] transition-[width] duration-300 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="font-mono uppercase text-[12px] font-black text-text-primary">
        {decided}/{total}
      </span>
    </div>
  );
}
