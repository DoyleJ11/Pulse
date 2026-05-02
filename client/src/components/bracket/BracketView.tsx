import { useCallback, useEffect, useState } from "react";
import { fetchBracket } from "../../services/api";
import { useRoomStore } from "../../stores/roomStore";
import { socket } from "../../utils/socket";
import { useAudioStore } from "../../stores/audioStore";
import { Matchup } from "./Matchup";
import { CARD_H, CARD_W, MATCHUP_H } from "./bracketLayout";
import { Crown } from "lucide-react";
import { Nav } from "../ui/Nav";
import { BracketProgress } from "./BracketProgress";
import { BracketHeader } from "./BracketHeader";
import { EndGameBtn } from "./EndGameBtn";
import { ViewChampionBtn } from "./ViewChampionBtn";
import { PermissionGuard } from "../util/PermissionGuard";
import { usePresence } from "../../hooks/usePresence";
import { useNavigate } from "react-router";
import { useToastStore } from "../../stores/toastStore";
import { useTokenStore } from "../../stores/tokenStore";
import { PreviewAlbumArt } from "../ui/PreviewAlbumArt";

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
  duration: number;
  previewUrl: string | null;
  submittedBy: string;
  role: "player_a" | "player_b";
  seed: number;
}

/* ============ Layout constants ============ */
const R1_GAP = 100; // vertical gap between R1 matchups (also fits active card B's pick button)
const ROW_H = MATCHUP_H + R1_GAP;
const COL_W = CARD_W; // uniform card width across all rounds
const CHAMPION_W = 420;
const COL_GAP = 400;
const TOP_PAD = 20;
const BOTTOM_PAD = 60;
// Horizontal inset for matchup content inside the canvas. Lanes still span
// 0 → totalW so colored bands bleed all the way to the canvas (and viewport) edges.
const LEFT_PAD = 40;
const RIGHT_PAD = 40;

/* ============ Bracket structure ============ */
// Flat 31-slot heap layout: index 0 = champion, children of i at 2i+1, 2i+2.
// Each round renders matchups whose result-slot is `parentIndex`, with competitors at 2p+1 and 2p+2.
const ROUNDS: { parentIndices: number[] }[] = [
  { parentIndices: [7, 8, 9, 10, 11, 12, 13, 14] }, // R16
  { parentIndices: [3, 4, 5, 6] }, // QF
  { parentIndices: [1, 2] }, // SF
  { parentIndices: [0] }, // F
];

/* ============ Round Headers ============ */
const HEADERS = [
  { title: "ROUND OF 16", subtitle: "8 MATCHUPS", bg: "#FFD952" },
  { title: "QUARTERS", subtitle: "4 MATCHUPS", bg: "#C4B5FD" },
  { title: "SEMIS", subtitle: "2 MATCHUPS", bg: "#2DD4BF" },
  { title: "FINALS", subtitle: "CHAMPIONSHIP", bg: "#95e615" },
  {
    title: "CHAMPION",
    subtitle: (
      <Crown className="w-8 h-8 text-black fill-black" strokeWidth={0} />
    ),
    bg: "#f55ba7",
  },
];

export function BracketView() {
  const navigate = useNavigate();
  const lobbyCode = useRoomStore((state) => state.code);
  const token = useTokenStore((state) => state.token);
  const players = useRoomStore((state) => state.players);
  const playerA = players.find((p) => p.role === "player_a");
  const playerB = players.find((p) => p.role === "player_b");
  const judge = players.find((p) => p.role === "judge");
  const isSoftDisconnected = usePresence();
  const hasDisconnected = players.some((p) => isSoftDisconnected(p.id));
  const [bracket, setBracket] = useState<Bracket>({
    id: "",
    roomId: "",
    currentMatchup: 7,
  });
  const [bracketSlots, setBracketSlots] = useState<(BracketSlot | null)[]>([]);
  const addError = useToastStore((state) => state.addError);

  const stop = useAudioStore((s) => s.stop);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const getBracket = useCallback(async () => {
    try {
      const resultBracket = await fetchBracket(lobbyCode, token);
      setBracket(resultBracket);
      const bracketState = resultBracket.state as (BracketSlot | null)[];
      setBracketSlots(bracketState);
    } catch (error) {
      addError(
        error,
        "Could not load the bracket. Please refresh and try again.",
      );
    }
  }, [lobbyCode, token, addError]);

  useEffect(() => {
    socket.on("bracketUpdated", ({ state, currentMatchup }) => {
      setBracketSlots(state);
      setBracket((prev) => ({ ...prev, currentMatchup }));
    });

    socket.on("bracketComplete", () => {
      console.log("Bracket complete!");
    });

    const onConnect = () => {
      getBracket();
    };
    socket.on("connect", onConnect);

    const onRoomEnded = () => {
      navigate(`/lobby/${lobbyCode}/postgame`);
    };
    socket.on("roomEnded", onRoomEnded);

    const initialFetch = setTimeout(() => {
      void getBracket();
    }, 0);

    return () => {
      clearTimeout(initialFetch);
      socket.off("bracketUpdated");
      socket.off("bracketComplete");
      socket.off("connect", onConnect);
      socket.off("roomEnded", onRoomEnded);
    };
  }, [getBracket, lobbyCode, navigate]);

  const onPick = (matchupIndex: number, winnerSongId: string) => {
    socket.emit("judgePick", {
      matchupIndex: matchupIndex,
      winnerSongId: winnerSongId,
    });
  };

  const decidedCount = bracketSlots
    .slice(0, 15)
    .filter((s) => s !== null).length;

  // Defensive: even if currentMatchup is set, the slots may be undefined
  // before the server response lands. Cast-free derivation so the null branch
  // catches both "no matchup" and "matchup pointer is ahead of loaded data".
  const matchupSongs: [BracketSlot, BracketSlot] | null = (() => {
    const idx = bracket.currentMatchup;
    if (idx === null) return null;
    const a = bracketSlots[2 * idx + 1];
    const b = bracketSlots[2 * idx + 2];
    return a && b ? [a, b] : null;
  })();

  /* ============ Layout math ============ */
  // R1 centers come from constants; later rounds are midpoints of their two children.
  const r1Centers = Array.from(
    { length: 8 },
    (_, i) => TOP_PAD + i * ROW_H + MATCHUP_H / 2,
  );
  const r2Centers = [0, 1, 2, 3].map(
    (i) => (r1Centers[i * 2] + r1Centers[i * 2 + 1]) / 2,
  );
  const sfCenters = [0, 1].map(
    (i) => (r2Centers[i * 2] + r2Centers[i * 2 + 1]) / 2,
  );
  const fCenters = [(sfCenters[0] + sfCenters[1]) / 2];
  const roundCenters = [r1Centers, r2Centers, sfCenters, fCenters];

  // Cumulative X positions per round. xs[0] starts at LEFT_PAD so matchup
  // content sits inset from the canvas edge while lanes still extend to 0.
  const xs: number[] = [LEFT_PAD];
  for (let i = 0; i < 3; i++) {
    xs.push(xs[i] + COL_W + COL_GAP);
  }
  const championX = xs[3] + COL_W + COL_GAP;
  const totalW = championX + CHAMPION_W + RIGHT_PAD;
  const totalH = TOP_PAD + 8 * ROW_H - R1_GAP + BOTTOM_PAD;

  // Connector layers — pair → parent for the bracket bends, plus a straight line F → champion.
  const connectorLayers = [
    { from: r1Centers, to: r2Centers, x1: xs[0] + COL_W, x2: xs[1] },
    { from: r2Centers, to: sfCenters, x1: xs[1] + COL_W, x2: xs[2] },
    { from: sfCenters, to: fCenters, x1: xs[2] + COL_W, x2: xs[3] },
  ];

  const champion = bracketSlots[0];

  // Higher-level guard: don't render anything until both data sources have loaded.
  // After this point, downstream code can assume players + bracket exist.
  const isReady = bracketSlots.length > 0 && !!playerA && !!playerB && !!judge;

  if (!isReady) {
    return (
      <div className="flex flex-col">
        <Nav rightSlot={null} />
        <div className="p-10 text-center text-text-primary/60 font-mono uppercase tracking-widest text-sm">
          Loading bracket…
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Nav rightSlot={<BracketProgress decided={decidedCount} total={15} />} />
      <BracketHeader
        matchupSongs={matchupSongs}
        champion={champion}
        judge={judge}
        playerA={playerA}
        playerB={playerB}
      />
      <div className="pt-10">
        <div className="overflow-x-auto no-scrollbar">
          <div className="relative" style={{ width: totalW }}>
            {/* Round lanes — full-height colored bands at 30% opacity behind everything.
                Boundaries fall at the midpoint of each COL_GAP so each column sits centered
                in its lane and adjacent lanes touch with no seam. The wrapper spans both
                the headers row and the canvas, so lanes paint behind both. */}
            {(() => {
              const boundaries = [
                0,
                xs[0] + COL_W + COL_GAP / 2, // R16 / QF
                xs[1] + COL_W + COL_GAP / 2, // QF / SF
                xs[2] + COL_W + COL_GAP / 2, // SF / F
                xs[3] + COL_W + COL_GAP / 2, // F / Champion
                totalW, // canvas right edge
              ];
              return HEADERS.map((header, i) => (
                <div
                  key={`lane-${header.title}`}
                  className="absolute inset-y-0"
                  style={{
                    left: boundaries[i],
                    width: boundaries[i + 1] - boundaries[i],
                    backgroundColor: `color-mix(in srgb, ${header.bg} 40%, transparent)`,
                  }}
                />
              ));
            })()}

            {/* Headers row — pt-10/pb-10 give 40px above (lane top → header top)
                and 40px below (header bottom → canvas top). */}
            <div
              className="relative flex gap-100 pt-10 pb-10 border-t-2 border-solid"
              style={{ paddingLeft: LEFT_PAD }}
            >
              {HEADERS.map((header) => {
                const isIconSubtitle = typeof header.subtitle !== "string";
                return (
                  <div
                    key={header.title}
                    className="flex justify-between items-baseline h-14 rounded-xl px-5.5 py-3.5 shadow-[3px_3px_0px_0px_#0A0A0A] border-solid border-2 tracking-widest box-border shrink-0"
                    style={{ backgroundColor: header.bg, width: CARD_W }}
                  >
                    <h1 className="text-base font-black uppercase">
                      {header.title}
                    </h1>
                    <span
                      className={`text-xs text-text-muted font-bold uppercase font-mono ${isIconSubtitle ? "self-center" : ""}`}
                    >
                      {header.subtitle}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="relative"
              style={{ width: totalW, height: totalH, minHeight: totalH }}
            >
              {/* Connector layer (SVG) — sits behind cards, no pointer events */}
              <svg
                width={totalW}
                height={totalH}
                className="absolute inset-0 pointer-events-none"
              >
                {connectorLayers.map((layer, li) =>
                  layer.to.map((c, i) => {
                    const p1 = layer.from[i * 2];
                    const p2 = layer.from[i * 2 + 1];
                    const mx = (layer.x1 + layer.x2) / 2;
                    return (
                      <g
                        key={`${li}-${i}`}
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                      >
                        <line x1={layer.x1} y1={p1} x2={mx} y2={p1} />
                        <line x1={layer.x1} y1={p2} x2={mx} y2={p2} />
                        <line x1={mx} y1={p1} x2={mx} y2={p2} />
                        <line x1={mx} y1={c} x2={layer.x2} y2={c} />
                      </g>
                    );
                  }),
                )}
                {/* Final → Champion: straight line from right edge of F column to left edge of champion card */}
                <line
                  x1={xs[3] + COL_W}
                  y1={fCenters[0]}
                  x2={championX}
                  y2={fCenters[0]}
                  stroke="black"
                  strokeWidth={3}
                  fill="none"
                />
              </svg>

              {/* Matchups — absolutely positioned by computed centers */}
              {ROUNDS.map((round, roundIdx) =>
                round.parentIndices.map((parentIndex, i) => (
                  <div
                    key={`${roundIdx}-${parentIndex}`}
                    className="absolute"
                    style={{
                      left: xs[roundIdx],
                      width: COL_W,
                      top: roundCenters[roundIdx][i] - MATCHUP_H / 2,
                      height: MATCHUP_H,
                    }}
                  >
                    <Matchup
                      bracketSlots={[
                        bracketSlots[2 * parentIndex + 1],
                        bracketSlots[2 * parentIndex + 2],
                      ]}
                      winnerSlot={bracketSlots[parentIndex]}
                      parentIndex={parentIndex}
                      currentMatchup={bracket.currentMatchup}
                      onPick={onPick}
                    />
                  </div>
                )),
              )}

              {/* Champion card */}
              <div
                className="absolute"
                style={{
                  left: championX,
                  width: CHAMPION_W,
                  top: fCenters[0] - CARD_H,
                }}
              >
                {champion ? (
                  <div className="bg-[#FFD952] border-[3px] border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div
                      className="mb-4 text-center text-4xl font-black uppercase tracking-tight text-black"
                      style={{ fontStretch: "condensed" }}
                    >
                      CHAMPION
                    </div>
                    <div className="flex items-center gap-6">
                      <PreviewAlbumArt
                        songId={champion.songId}
                        previewUrl={champion.previewUrl}
                        albumArt={champion.albumArt}
                        title={champion.title}
                        className="h-24 w-24 rounded-2xl border-[3px] border-black"
                      />
                      <div className="flex-1">
                        <div className="text-2xl font-black text-black mb-1">
                          {champion.title}
                        </div>
                        <div className="text-lg font-bold text-black/70 mb-2">
                          {champion.artist}
                        </div>
                        <div className="inline-block bg-black text-[#FFD952] px-4 py-1 rounded-full border-[3px] border-black">
                          <span className="font-black text-sm">
                            {champion.role === "player_a"
                              ? "PLAYER A"
                              : "PLAYER B"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-50 bg-[#FFD952] border-[3px] border-dashed border-black rounded-3xl flex flex-col items-center justify-center">
                    <div className="text-black/40 font-black text-lg">
                      AWAITING CHAMPION
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {champion ? (
        <ViewChampionBtn />
      ) : (
        hasDisconnected && (
          <PermissionGuard allowedRoles={["player_a", "player_b", "judge"]}>
            <EndGameBtn />
          </PermissionGuard>
        )
      )}
    </div>
  );
}
