import { useEffect, useState } from "react";
import { fetchBracket } from "../../services/api";
import { useRoomStore } from "../../stores/roomStore";
import { BracketPairing } from "./BracketPairing";
import { socket } from "../../utils/socket";
import { useAudioStore } from "../../stores/audioStore";

interface Bracket {
  id: string;
  roomId: string;
  currentMatchup: number | null;
}

export interface BracketSlot {
  songId: string;
  deezerId: string;
  title: string;
  artist: string;
  albumArt: string;
  previewUrl: string | null;
  submittedBy: string;
  role: "player_a" | "player_b";
  seed: number;
}

export function BracketView() {
  const lobbyCode = useRoomStore((state) => state.code);
  const [bracket, setBracket] = useState<Bracket>({
    id: "",
    roomId: "",
    currentMatchup: 7,
  });
  const [bracketSlots, setBracketSlots] = useState<(BracketSlot | null)[]>([]);

  const stop = useAudioStore((s) => s.stop); // or pull through the hook

  useEffect(() => {
    return () => stop();
  }, [stop]);

  useEffect(() => {
    socket.on("bracketUpdated", ({ state, currentMatchup }) => {
      setBracketSlots(state);
      setBracket((prev) => ({ ...prev, currentMatchup }));
    });

    socket.on("bracketComplete", () => {
      console.log("Bracket complete!");
    });

    getBracket();

    return () => {
      socket.off("bracketUpdated");
      socket.off("bracketComplete");
    };
  }, []);

  const getBracket = async () => {
    const resultBracket = await fetchBracket(lobbyCode);
    setBracket(resultBracket);
    const bracketState = resultBracket.state as (BracketSlot | null)[];
    setBracketSlots(bracketState);
  };

  const onPick = (matchupIndex: number, winnerSongId: string) => {
    socket.emit("judgePick", {
      code: lobbyCode,
      matchupIndex: matchupIndex,
      winnerSongId: winnerSongId,
    });
  };

  return (
    <div className="m-6 p-4">
      <div className="overflow-x-auto">
        <div className="flex flex-row gap-12 items-center w-max">
          <BracketPairing
            parentIndex={0}
            round={4}
            bracket={bracketSlots}
            currentMatchup={bracket.currentMatchup}
            onPick={onPick}
          />
          {bracketSlots[0] ? (
            <div className="w-[420px] shrink-0 bg-[#FFD952] border-[3px] border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div
                className="text-4xl font-black text-black uppercase tracking-tight mb-4"
                style={{ fontStretch: "condensed" }}
              >
                CHAMPION
              </div>

              <div className="flex items-center gap-6">
                <img
                  src={bracketSlots[0].albumArt}
                  alt={bracketSlots[0].title}
                  className="w-24 h-24 rounded-2xl object-cover border-[3px] border-black"
                />
                <div className="flex-1">
                  <div className="text-2xl font-black text-black mb-1">
                    {bracketSlots[0].title}
                  </div>
                  <div className="text-lg font-bold text-black/70 mb-2">
                    {bracketSlots[0].artist}
                  </div>
                  <div className="inline-block bg-black text-[#FFD952] px-4 py-1 rounded-full border-[3px] border-black">
                    <span className="font-black text-sm">
                      {bracketSlots[0].role === "player_a"
                        ? "PLAYER A"
                        : "PLAYER B"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-105 h-50 bg-[#FFD952] border-[3px] border-dashed border-black rounded-3xl flex flex-col items-center justify-center shrink-0">
              <div className="text-black/40 font-black text-lg">
                AWAITING CHAMPION
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
