import { Nav } from "../ui/Nav";
import { HomeButton } from "../home/HomeButton";
import { Check, Copy, Settings, ArrowRight, ChevronDown } from "lucide-react";
import { Pill } from "../home/Pill";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore, type Player } from "../../stores/roomStore";
import { socket } from "../../utils/socket";
import { startPicking } from "../../services/api";
import { useNavigate } from "react-router";
import { useTokenStore } from "../../stores/tokenStore";
import { type Role, type Status } from "../../types/sharedTypes";
import { useToastStore } from "../../stores/toastStore";
import { FloatingShape } from "../home/DecorativeShape";

const palette = {
  coral: "var(--color-section-coral)",
  teal: "var(--color-section-teal)",
  golden: "var(--color-section-golden)",
  lavender: "var(--color-section-lavender)",
  ink: "var(--color-text-primary)",
  pink: "var(--color-pink)",
};

const smallShadow = "3px_3px_0_0_#0A0A0A";

const SPECTATOR_COLORS = [
  palette.lavender,
  palette.coral,
  palette.golden,
  palette.teal,
];

const MAX_SPECTATOR_CIRCLES = 4;

const ROLE_OPTIONS: { role: Exclude<Role, null>; label: string }[] = [
  { role: "player_a", label: "Player A" },
  { role: "player_b", label: "Player B" },
  { role: "judge", label: "Judge" },
  { role: "spectator", label: "Spectator" },
];

function roleColor(role: string) {
  if (role === "player_b") return palette.teal;
  if (role === "judge") return palette.golden;
  if (role === "spectator") return palette.lavender;
  return palette.coral;
}

function roleLabel(role: string) {
  return (
    ROLE_OPTIONS.find((option) => option.role === role)?.label ?? "Player A"
  );
}

function RoleDropdown({
  currentRole,
  takenPlayerSlots,
}: {
  currentRole: string;
  takenPlayerSlots: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleSelect = (newRole: Exclude<Role, null>) => {
    setOpen(false);
    if (newRole === currentRole) return;
    socket.emit("changeRole", { newRole });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center gap-2 border-ink rounded-full py-1 pr-2.5 pl-3 font-black text-xs tracking-wider uppercase cursor-pointer text-ink"
        style={{ backgroundColor: roleColor(currentRole) }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {roleLabel(currentRole)}
        <ChevronDown
          aria-hidden="true"
          size={14}
          strokeWidth={3}
          className={`transition-[rotate] duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 bg-white border-ink rounded-[14px] shadow-small z-50 min-w-[140px] overflow-hidden">
          {ROLE_OPTIONS.filter(
            (option) =>
              option.role !== currentRole &&
              !takenPlayerSlots.has(option.role),
          ).map((option, i) => (
              <button
                key={option.role}
                className={`flex items-center gap-2.5 w-full py-2.5 px-3.5 bg-white font-black text-sm tracking-wide text-left cursor-pointer text-ink ${i !== 0 ? "border-t-[1.5px] border-t-ink/10" : ""}`}
                onClick={() => handleSelect(option.role)}
                role="option"
              >
                <span
                  className="w-3 h-3 rounded-full border-[1.5px] border-text-primary"
                  style={{ backgroundColor: roleColor(option.role) }}
                />
                {option.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function Lobby() {
  const navigate = useNavigate();
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
  const token = useTokenStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const playerList = useRoomStore((state) => state.players);
  const hostId = useRoomStore((state) => state.hostId);
  const setStatus = useRoomStore((state) => state.setStatus);
  const lobbyCode = useRoomStore((state) => state.code);
  const addError = useToastStore((state) => state.addError);

  useEffect(() => {
    const onStartPicking = ({ status }: { status: Status }) => {
      setStatus(status);
      navigate(`/lobby/${lobbyCode}/picking`);
    };

    socket.on("startPicking", onStartPicking);

    return () => {
      socket.off("startPicking", onStartPicking);
    };
  }, [lobbyCode, navigate, setStatus]);

  const handleStartPicking = async () => {
    try {
      await startPicking(lobbyCode, token);
    } catch (error) {
      addError(error, "Could not start the game. Please try again.");
    }
  };

  const [copied, setCopied] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(lobbyCode);
      setCopied(true);
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
      copyResetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addError(error, "Couldn't copy the code. Try selecting it manually.");
    }
  };

  const activePlayers = playerList.filter((p) => p.role !== "spectator");
  const spectators = playerList.filter((p) => p.role === "spectator");
  const totalSeats = (Math.floor(activePlayers.length / 4) + 1) * 4;
  const emptySeatCount = totalSeats - activePlayers.length;

  const playerACount = playerList.filter((p) => p.role === "player_a").length;
  const playerBCount = playerList.filter((p) => p.role === "player_b").length;
  const judgeCount = playerList.filter((p) => p.role === "judge").length;

  const takenPlayerSlots = new Set<string>();
  if (playerACount > 0) takenPlayerSlots.add("player_a");
  if (playerBCount > 0) takenPlayerSlots.add("player_b");
  const isReady =
    playerList.length >= 3 &&
    playerACount === 1 &&
    playerBCount === 1 &&
    judgeCount >= 1;

  const waitingMessage = (() => {
    if (isReady) return null;
    const playersNeeded =
      (playerACount === 0 ? 1 : 0) + (playerBCount === 0 ? 1 : 0);
    const needsJudge = judgeCount === 0;
    const parts: string[] = [];
    if (playersNeeded === 1) parts.push("one more player");
    else if (playersNeeded === 2) parts.push("2 players");
    if (needsJudge) parts.push("a judge");
    return parts.length > 0 ? parts.join(" and ") : null;
  })();

  const me = playerList.find((p) => p.id === userId);
  const iAmSpectator = me?.role === "spectator";

  const visibleSpectators = spectators.slice(0, MAX_SPECTATOR_CIRCLES);
  const spectatorNames = visibleSpectators
    .map((s, i) =>
      i === visibleSpectators.length - 1 &&
      spectators.length > MAX_SPECTATOR_CIRCLES
        ? `${s.name}...`
        : s.name,
    )
    .join(", ");

  return (
    <>
      <Nav
        rightSlot={
          <div className="flex items-center gap-2.5">
            <button
              className={`inline-flex items-center gap-2.5 text-text-primary border-2 border-text-primary rounded-[14px] py-2 pr-3 pl-3.5 font-mono font-bold text-lg tracking-[0.18em] cursor-pointer shadow-[${smallShadow}]`}
              style={{ backgroundColor: palette.golden }}
              onClick={handleCopyCode}
            >
              <span className="text-xs tracking-[0.15em] font-black opacity-60 uppercase">
                <span>Code</span>
              </span>
              {lobbyCode}
              <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-white border-[1.5px] border-text-primary">
                {copied ? (
                  <Check aria-hidden="true" size={12} strokeWidth={3} />
                ) : (
                  <Copy aria-hidden="true" size={12} strokeWidth={3} />
                )}
              </span>
            </button>
            <button
              className={`inline-flex items-center justify-center w-10 h-10 p-0 bg-white border-2 border-text-primary rounded-xl cursor-pointer shadow-[${smallShadow}]`}
            >
              <Settings aria-hidden="true" size={24} strokeWidth={2} />
            </button>

            <HomeButton
              size="medium"
              variant="light"
              onClick={() => console.log("leave")}
            >
              <span className="uppercase text-sm">LEAVE</span>
            </HomeButton>
          </div>
        }
      />

      <section className="pt-5 pb-20 px-10 relative min-h-[calc(-92px+100vh)]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <FloatingShape
            type="star"
            color={palette.pink}
            className="top-[15%] left-[4%] h-22.5 w-22.5"
          />
          <FloatingShape
            type="circle"
            color={palette.teal}
            className="top-[20%] right-[6%] h-20 w-20"
          />
          <FloatingShape
            type="diamond"
            color={palette.golden}
            className="top-[60%] left-[6%] h-17.5 w-17.5"
          />
          <FloatingShape
            type="star"
            color={palette.coral}
            className="top-[75%] right-[10%] h-12.5 w-12.5"
          />
        </div>
        <div className="relative z-2 max-w-[1080px] my-0 mx-auto">
          <div className="mb-7 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <Pill color={palette.coral} className="mb-3.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-text-primary animate-pulse-dot"></span>
                <span>Invite your friends</span>
              </Pill>

              <h1 className="display text-[clamp(72px,10vw,128px)] m-0">
                <span>Who's</span>
                <br></br>
                <span>here.</span>
              </h1>
            </div>

            <div
              className={`inline-flex items-center gap-3 bg-white border-ink rounded-2xl py-3 px-4.5 shadow-[${smallShadow}]`}
            >
              <span
                className="relative inline-block w-3.5 h-3.5 rounded-full border-ink"
                style={{
                  backgroundColor: isReady ? palette.teal : palette.coral,
                }}
              >
                <span
                  className="absolute -inset-1.5 rounded-full border-2 wait-ring"
                  style={{
                    borderColor: isReady ? palette.teal : palette.coral,
                  }}
                ></span>
              </span>
              <span className="text-sm font-extrabold tracking-[0.01em]">
                {isReady ? "Ready to go!" : "Waiting on…"}
                <span className="font-semibold text-ink/60 ml-2">
                  {isReady
                    ? "The host may start the lobby."
                    : `Need ${waitingMessage}.`}
                </span>
              </span>
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-5.5">
            {activePlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                hostId={hostId}
                userId={userId}
                takenPlayerSlots={takenPlayerSlots}
              />
            ))}
            {Array.from({ length: emptySeatCount }, (_, i) => (
              <EmptyPlayerCard key={`empty-${i}`} />
            ))}
          </div>

          {spectators.length > 0 && (
            <div className="bg-white border-ink rounded-2xl py-3.5 px-4.5 flex items-center gap-3.5 flex-wrap mb-5.5">
              <span className="font-bold text-xs tracking-[1.5] text-ink/60 font-mono">
                WATCHING
              </span>
              <div className="flex">
                {visibleSpectators.map((spectator, index) => (
                  <SpectatorCircle
                    key={spectator.id}
                    index={index}
                    initial={spectator.name[0]}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">
                <span>+</span>
                {spectators.length}
                <span> watching · </span>
                {spectatorNames}
              </span>
              {iAmSpectator && (
                <div className="ml-auto">
                  <RoleDropdown
                    currentRole="spectator"
                    takenPlayerSlots={takenPlayerSlots}
                  />
                </div>
              )}
            </div>
          )}

          {userId === hostId && (
            <div className="flex justify-end">
              <HomeButton
                size="large"
                variant="dark"
                onClick={handleStartPicking}
                disabled={!isReady}
              >
                <span>Start Game</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
              </HomeButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PlayerCard({
  player,
  hostId,
  userId,
  takenPlayerSlots,
}: {
  player: Player;
  hostId: string;
  userId: string;
  takenPlayerSlots: Set<string>;
}) {
  const bgColor = roleColor(player.role);
  const initial = player.name[0];
  const isMe = player.id === userId;

  return (
    <div
      className="border-ink rounded-[20px] shadow-small p-4.5 flex flex-col gap-3 relative min-h-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-14 h-14 shrink-0 border-ink rounded-full flex items-center justify-center font-black text-2xl text-ink tracking-tight"
          style={{ backgroundColor: bgColor }}
        >
          {initial}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {hostId === player.id && (
            <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-ink text-white rounded-md font-black text-[10px] tracking-widest uppercase whitespace-nowrap">
              ★ Host
            </span>
          )}
          {isMe && (
            <span className="py-0.5 px-2 bg-bg-cream text-ink border-1.5 border-ink/20 rounded-md font-black text-[10px] tracking-widest uppercase whitespace-nowrap">
              You
            </span>
          )}
        </div>
      </div>
      <div className="display text-[28px] leading-[1] tracking-tight">
        {player.name}
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-xs tracking-[0.15em] text-ink/60 uppercase">
          ROLE
        </span>
        {isMe ? (
          <RoleDropdown
            currentRole={player.role}
            takenPlayerSlots={takenPlayerSlots}
          />
        ) : (
          <span
            className="inline-flex items-center border-ink rounded-full py-1 px-3 font-black text-xs tracking-wider uppercase text-ink"
            style={{ backgroundColor: bgColor }}
          >
            {roleLabel(player.role)}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyPlayerCard() {
  return (
    <div className="bg-white border-dashed border-2 border-text-primary/40 rounded-[20px] p-4.5 flex flex-col gap-3 min-h-45 items-center justify-center text-ink/40 text-center">
      <div className="h-14 w-14 rounded-full border-dashed border-2 border-text-primary/40 flex items-center justify-center font-black text-[28px]">
        <span>+</span>
      </div>
      <div className="font-black text-sm">
        <span>OPEN SEAT</span>
      </div>
      <div className="font-semibold text-xs">
        <span>Share the code →</span>
      </div>
    </div>
  );
}

function SpectatorCircle({
  index,
  initial,
}: {
  index: number;
  initial: string;
}) {
  const color = SPECTATOR_COLORS[index % SPECTATOR_COLORS.length];
  return (
    <div style={{ marginLeft: index === 0 ? 0 : -8 }}>
      <div
        className="w-7.5 h-7.5 border-ink rounded-full flex items-center justify-center font-black text-sm text-ink tracking-tight"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
    </div>
  );
}
