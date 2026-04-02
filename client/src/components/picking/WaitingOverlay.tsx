import { Lock } from "lucide-react";

export function WaitingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-bg-card border-border-heavy rounded-3xl px-12 py-10 text-center"
        style={{ borderWidth: "var(--border-weight-heavy)" }}
      >
        <div className="flex justify-center mb-4">
          <Lock className="w-10 h-10 text-text-primary" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase mb-2">
          LOCKED IN
        </h2>
        <p className="text-lg font-bold text-text-secondary">
          Waiting for the other player...
        </p>
      </div>
    </div>
  );
}
