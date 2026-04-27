export function PlayerChip({
  role,
  name,
}: {
  role: "player_a" | "player_b" | null;
  name: string | null;
}) {
  return (
    <div
      className="inline-flex items-center gap-2.5 border-2 border-solid border-text-primary rounded-full py-[5px] pl-[5px] pr-4"
      style={{ backgroundColor: role === "player_a" ? "#FF7B6B" : "#2DD4BF" }}
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-text-primary text-white font-black text-sm shrink-0">
        {role === "player_a" ? "A" : "B"}
      </span>
      <span className="font-black text-base text-text-primary">{name}</span>
    </div>
  );
}
