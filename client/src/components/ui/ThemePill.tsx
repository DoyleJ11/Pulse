export function ThemePill({ themeWord }: { themeWord: string }) {
  return (
    <div className="inline-flex bg-[#C4B5FD] border-[3px] border-text-primary rounded-full px-5 py-1.5 shadow-[3px_3px_0_0_#0A0A0A]">
      <span className="text-base font-black text-text-primary">
        Theme: <span className="uppercase">{themeWord}</span>
      </span>
    </div>
  );
}
