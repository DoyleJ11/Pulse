export function EmptySlot() {
  return (
    <div
      className="bg-transparent border-border-subtle border-dashed rounded-card p-4 h-[86px] flex items-center justify-center"
      style={{
        borderWidth: "var(--border-weight-heavy)",
      }}
    >
      <div className="text-text-muted font-bold">+ Add a song</div>
    </div>
  );
}
