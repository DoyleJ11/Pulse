import { Nav } from "../ui/Nav";
import { HomeButton } from "../home/HomeButton";
import { Copy, Settings, ArrowRight, ChevronDown } from "lucide-react";
import { Pill } from "../home/Pill";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore, type Player } from "../../stores/roomStore";
import { socket } from "../../utils/socket";
import { startPicking } from "../../services/api";
import { useNavigate } from "react-router";
import { useTokenStore } from "../../stores/tokenStore";
import { type Status } from "../../types/sharedTypes";
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

  return (
    <>
      <Nav
        rightSlot={
          <div className="flex items-center gap-2.5">
            <button
              className={`inline-flex items-center gap-2.5 text-text-primary border-2 border-text-primary rounded-[14px] py-2 pr-3 pl-3.5 font-mono font-bold text-lg tracking-[0.18em] cursor-pointer shadow-[${smallShadow}]`}
              style={{ backgroundColor: palette.golden }}

              //   onClick={} -> TO DO: Change button icon to check mark on click for 2 seconds, then change back
            >
              <span className="text-xs tracking-[0.15em] font-black opacity-60 uppercase">
                <span>Code</span>
              </span>
              {/* Code var goes here */}
              ABC123
              <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-white border-[1.5px] border-text-primary">
                <Copy aria-hidden="true" size={12} strokeWidth={3} />
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
              <span className="relative inline-block w-3.5 h-3.5 rounded-full border-ink bg-teal">
                <span className="absolute -inset-1.5 rounded-full border-2 border-teal wait-ring"></span>
              </span>
              <span className="text-sm font-extrabold tracking-[0.01em]">
                Ready to go!
                <span className="font-semibold text-ink/60 ml-2">
                  The host may start the lobby.
                </span>
              </span>
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-5.5">
            {playerList.map((player, index) => (
              <PlayerCard player={player} hostId={hostId} />
            ))}
            <EmptyPlayerCard />
            <EmptyPlayerCard />
            <EmptyPlayerCard />
          </div>

          <div className="bg-white border-ink rounded-2xl py-3.5 px-4.5 flex items-center gap-3.5 flex-wrap mb-5.5">
            <span className="font-bold text-xs tracking-[1.5] text-ink/60 font-mono">
              WATCHING
            </span>
            <div className="flex">
              {/* spectator circles here */}
              <SpectatorCircle marginLeft={"0px"} inital="J" />
              <SpectatorCircle
                marginLeft={"-8px"}
                inital="A"
                color={palette.coral}
              />
            </div>
            <span className="text-sm font-bold">
              <span>+</span>
              {/* spectator number here */}2<span> watching · </span>
              {/* List of spectator names go here */}
              Jack, Alyssa
            </span>
          </div>

          {userId === hostId && (
            <div className="flex justify-end">
              <HomeButton
                size="large"
                variant="dark"
                onClick={handleStartPicking}
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

function PlayerCard({ player, hostId }: { player: Player; hostId: string }) {
  let bgColor = "#ff7b6b";
  let roleIndex = 0;
  const roles = ["Player A", "Player B", "Judge", "Spectator"];
  if (player.role === "player_b") {
    bgColor = "#2dd4bf";
    roleIndex = 1;
  } else if (player.role === "judge") {
    bgColor = "#ffd952";
    roleIndex = 2;
  } else if (player.role === "spectator") {
    roleIndex = 3;
  }
  const initial = player.name[0];

  return (
    // Add animation delay that starts at 0 and adds 60ms per card
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
          {/* Only render for connected user's card */}
          <span className="py-0.5 px-2 bg-bg-cream text-ink border-1.5 border-ink/20 rounded-md font-black text-[10px] tracking-widest uppercase whitespace-nowrap">
            You
          </span>
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
        <div className="relative">
          {/* Need to add dropdown logic/styling */}
          <button
            className="inline-flex items-center gap-2 border-ink rounded-full py-1 pr-2.5 pl-3 font-black text-xs tracking-wider uppercase cursor-pointer text-ink"
            style={{ backgroundColor: bgColor }}
          >
            {roles[roleIndex]}
            {/* Only render down chevron for current user's card */}
            <ChevronDown aria-hidden="true" size={14} strokeWidth={3} />
          </button>
        </div>
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
  marginLeft,
  inital,
  color,
}: {
  marginLeft: string;
  inital: string;
  color?: string;
}) {
  return (
    <div style={{ marginLeft: marginLeft }}>
      {/* shuffle through colors based on index */}
      <div
        className="w-7.5 h-7.5 border-ink rounded-full flex items-center justify-center font-black text-sm text-ink tracking-tight"
        style={{ backgroundColor: color ? color : "#c4b5fd" }}
      >
        {inital}
      </div>
    </div>
  );
}
