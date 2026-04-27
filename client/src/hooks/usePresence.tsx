import { useState, useEffect } from "react";
import { useRoomStore } from "../stores/roomStore";

const GRACE_MS = 5000;

// Returns isSoftDisconnected(id) — true only when the player has been
// disconnected per the server for at least GRACE_MS. Brief blips don't
// flicker the UI; persistent disconnects surface after the grace period.
export function usePresence() {
  const players = useRoomStore((state) => state.players);
  const [softDisconnected, setSoftDisconnected] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

    for (const player of players) {
      if (!player.connected) {
        const t = setTimeout(() => {
          setSoftDisconnected((prev) => ({ ...prev, [player.id]: true }));
        }, GRACE_MS);
        timeouts.set(player.id, t);
      } else {
        // Connected → clear any prior soft-disconnected flag immediately.
        const t = setTimeout(() => {
          setSoftDisconnected((prev) =>
            prev[player.id] ? { ...prev, [player.id]: false } : prev,
          );
        }, 0);
        timeouts.set(player.id, t);
      }
    }

    return () => timeouts.forEach(clearTimeout);
  }, [players]);

  return (playerId: string) => softDisconnected[playerId] === true;
}
