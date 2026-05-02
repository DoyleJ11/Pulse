import { type BracketSlot } from "./BracketView";
import { PlayerChip } from "./PlayerChip";
import { usePresence } from "../../hooks/usePresence";
import type { Player } from "../../stores/roomStore";
import { Crown } from "lucide-react";

interface BracketHeaderProps {
  matchupSongs: [BracketSlot, BracketSlot] | null;
  champion: BracketSlot | null;
  judge: Player;
  playerA: Player;
  playerB: Player;
}

export function BracketHeader({
  matchupSongs,
  champion,
  judge,
  playerA,
  playerB,
}: BracketHeaderProps) {
  const isSoftDisconnected = usePresence();
  return (
    <div className="px-10 pt-4 pb-8">
      <div className="max-w-[1600px] flex justify-between items-end gap-10 flex-wrap my-0 mx-auto">
        <div>
          <h1 className="text-[clamp(48px,6vw,88px)] m-0 uppercase font-black whitespace-nowrap">
            THE BRACKET
          </h1>
          <div className="flex items-center gap-3 ml-4">
            <PlayerChip
              role="player_a"
              name={playerA.name}
              connected={!isSoftDisconnected(playerA.id)}
            />
            <span className="text-text-primary/40 text-2xl my-0 mx-2.5 font-black tracking-tight">
              vs
            </span>
            <PlayerChip
              role="player_b"
              name={playerB.name}
              connected={!isSoftDisconnected(playerB.id)}
            />
            <span className="text-xs font-bold tracking-widest text-text-primary/60 font-mono whitespace-nowrap">
              · JUDGE: {judge.name}
            </span>
          </div>
        </div>

        {champion ? (
          <div className="flex min-w-[320px] items-center gap-3 rounded-[20px] border-2 border-solid border-text-primary bg-[#FFD952] px-[22px] py-4 shadow-[3px_3px_0_0_#0A0A0A]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black">
              <Crown
                className="h-5 w-5 fill-[#FFD952] text-[#FFD952]"
                strokeWidth={0}
              />
            </span>
            <div>
              <div className="text-xs font-bold tracking-widest text-text-primary/60 font-mono uppercase">
                CHAMPION CROWNED
              </div>
              <div className="mt-1 max-w-[320px] truncate text-xl font-black">
                {champion.title}
              </div>
            </div>
          </div>
        ) : matchupSongs ? (
          <div className="min-w-[320px] flex items-center gap-3 bg-white border-2 border-solid border-text-primary rounded-[20px] py-4 px-[22px] shadow-[3px_3px_0_0_#0A0A0A]">
            <span className="w-3 h-3 rounded-full bg-[#FF7B6B] border-[1.5px] border-solid border-text-primary animate-pulse-dot shrink-0"></span>
            <div>
              <div className="text-xs font-bold tracking-widest text-text-primary/60 font-mono uppercase">
                NOW JUDGING
              </div>
              <div className="text-xl mt-1 font-black">
                <span className="inline-block max-w-[180px] truncate align-middle">
                  {matchupSongs[0].title}
                </span>
                <span className="text-text-primary/40 my-0 mx-2.5 align-middle">
                  vs
                </span>
                <span className="inline-block max-w-[180px] truncate align-middle">
                  {matchupSongs[1].title}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
