import { ArrowRight, Check, Clock3, Plus } from "lucide-react";
import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Nav } from "../ui/Nav";
import { MarqueeStrip } from "../home/MarqueeStrip";
import { StepCard } from "../home/StepCard";

const marqueeItems = [
  "BRING YOUR TASTE",
  "PICK 8 SONGS",
  "BUILD THE BRACKET",
  "JUDGE EACH MATCHUP",
  "CROWN A CHAMPION",
];

const palette = {
  coral: "var(--color-section-coral)",
  teal: "var(--color-section-teal)",
  golden: "var(--color-section-golden)",
  lavender: "var(--color-section-lavender)",
  ink: "var(--color-text-primary)",
};

function HomePage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPlay = () => navigate("/play");

  const scrollToHow = () => {
    document.getElementById("how")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg-cream text-text-primary">
      <Nav
        rightSlot={
          <div className="hidden flex-wrap items-center justify-end gap-1.5 md:flex">
            <HomeButton onClick={goHome}>Home</HomeButton>
            <HomeButton onClick={scrollToHow}>How it works</HomeButton>
            <HomeButton variant="dark" onClick={goPlay}>
              Play now{" "}
              <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
            </HomeButton>
          </div>
        }
      />
      <HeroSection onPlay={goPlay} onHowItWorks={scrollToHow} />
      <MarqueeStrip items={marqueeItems} />
      <HowItWorksSection />
      <FinalCta onPlay={goPlay} />
      <HomeFooter />
    </main>
  );
}

function HeroSection({
  onPlay,
  onHowItWorks,
}: {
  onPlay: () => void;
  onHowItWorks: () => void;
}) {
  return (
    <section className="relative px-10 pt-10 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <FloatingShape
          type="circle"
          color={palette.coral}
          className="left-[4%] top-[18%] h-24 w-24 lg:left-[6%] lg:top-[20%] lg:h-[90px] lg:w-[90px]"
        />
        <FloatingShape
          type="star"
          color={palette.golden}
          className="bottom-[13%] left-[8%] h-[70px] w-[70px]"
        />
        <FloatingShape
          type="circle"
          color={palette.lavender}
          className="bottom-[16%] right-[12%] h-[50px] w-[50px]"
        />
      </div>

      <div className="relative z-2 max-w-[1280px] my-0 mx-auto">
        <div className="grid gap-12 grid-cols-[1.25fr_1fr] items-center">
          <div className="">
            <div className="flex gap-2 mb-6">
              <Pill color={palette.lavender}>● 3-player party game</Pill>
              <Pill color={palette.golden}>No install</Pill>
            </div>

            <h1 className="text-[clamp(72px,10vw,148px)] mx-0 mt-0 mb-5 font-black uppercase leading-[0.92] tracking-tight">
              <span className="">Whose</span>
              <br></br>
              <span className="inline-flex items-center gap-4.5">
                Taste{" "}
                <span className="inline-block bg-section-coral border-3 border-black rounded-3xl px-5.5 py-1.5 -rotate-3 text-[0.7em] shadow-[6px_6px_0_#0A0A0A]">
                  Wins?
                </span>
              </span>
            </h1>

            <p className="text-xl leading-[1.45] font-medium text-text-secondary/80 max-w-[520px] mb-8">
              A 3-player music bracket game. Two friends pick songs, one friend
              judges. Loud arguments guaranteed.
            </p>

            <div className="flex flex-wrap gap-3.5">
              <HomeButton size="large" variant="dark" onClick={onPlay}>
                Start a game{" "}
                <ArrowRight aria-hidden="true" size={24} strokeWidth={3} />
              </HomeButton>
              <HomeButton size="large" onClick={onHowItWorks}>
                How it works
              </HomeButton>
            </div>

            <div className="flex gap-4 mt-8 items-center">
              <div className="flex">
                {[
                  palette.coral,
                  palette.teal,
                  palette.golden,
                  palette.lavender,
                ].map((color, index) => (
                  <span
                    key={color}
                    className="h-9 w-9 rounded-full border-2 border-black"
                    style={{
                      backgroundColor: color,
                      marginLeft: index === 0 ? 0 : -12,
                    }}
                  />
                ))}
              </div>
              <span className="text-[13px] font-bold text-text-secondary/70">
                2.4k brackets settled this week
              </span>
            </div>
          </div>

          <LiveBracketCard />
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how"
      className="px-5 py-24 sm:px-10 lg:px-10 lg:pb-10 lg:pt-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Pill color={palette.teal} className="mb-4">
              How it works
            </Pill>
            <h2 className="max-w-[840px] text-[clamp(3.5rem,8vw,6rem)] font-black leading-[0.92] tracking-[-0.04em]">
              Three rounds.
              <br />
              One champion.
            </h2>
          </div>
          <p className="max-w-[380px] text-lg font-medium leading-normal text-text-secondary/70">
            Grab two friends. One of you judges, the other two go head to head
            with the songs they love most.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <StepCard
            accent={palette.coral}
            body="Both players get 8 slots. Search, scroll, and stack your lineup: bangers only."
            demo={<PickSongsDemo />}
            number="01"
            title="Pick 8 songs"
          />
          <StepCard
            accent={palette.golden}
            body="16 songs get shuffled into a March-Madness-style bracket. Round 1 begins immediately."
            demo={<BracketDemo />}
            number="02"
            title="Build the bracket"
          />
          <StepCard
            accent={palette.teal}
            body="The third player listens and picks a winner, matchup by matchup, until one song is crowned."
            demo={<JudgeDemo />}
            number="03"
            title="Judge each battle"
          />
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onPlay }: { onPlay: () => void }) {
  return (
    <section className="px-5 pb-28 pt-12 sm:px-10 lg:px-10 lg:pb-32 lg:pt-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-black bg-section-coral px-6 py-20 text-center shadow-[10px_10px_0_#0A0A0A] sm:px-12 lg:py-20">
          <DecorativeShape
            type="star"
            color={palette.golden}
            className="absolute -left-8 -top-8 h-36 w-36 lg:h-[140px] lg:w-[140px]"
          />
          <DecorativeShape
            type="diamond"
            color={palette.lavender}
            className="absolute -bottom-12 -right-10 h-36 w-36 lg:h-[160px] lg:w-[160px]"
          />
          <div className="relative z-10">
            <h2 className="mb-4 text-[clamp(4rem,9vw,8rem)] font-black uppercase leading-none tracking-[-0.04em]">
              Ready to argue?
            </h2>
            <p className="mb-8 text-xl font-medium">
              Takes seconds to set up. Takes all night to recover.
            </p>
            <HomeButton size="large" variant="dark" onClick={onPlay}>
              Create or join a lobby{" "}
              <ArrowRight aria-hidden="true" size={26} strokeWidth={3} />
            </HomeButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="flex flex-col gap-6 border-t-2 border-black px-10 py-7 text-[13px] font-black text-text-secondary md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-xl uppercase tracking-tight">Pulse</span>
        <span>&copy; 2026 &middot; Made for late-night arguments</span>
      </div>
      <div className="flex gap-8">
        <span>About</span>
        <span>Privacy</span>
        <span>Discord</span>
      </div>
    </footer>
  );
}

function LiveBracketCard() {
  return (
    <div className="p-6 rotate-2 rounded-4xl border-2 border-black bg-white p-7 shadow-[10px_10px_0_#0A0A0A]">
      <div className="mb-4 flex items-center justify-between gap-5">
        <Pill color={palette.coral}>Live bracket</Pill>
        <span className="font-mono text-[11px] font-black uppercase tracking-wide text-text-secondary">
          RM: DISCO7
        </span>
      </div>
      <BracketVisual className="aspect-[300/220] w-full" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-black bg-bg-cream px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Vinyl color={palette.coral} size={32} />
          <span className="text-sm font-black">
            Now judging: R2 &middot; M1
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-black text-text-secondary/70">
          <Clock3 aria-hidden="true" size={14} strokeWidth={3} />
          00:12
        </span>
      </div>
    </div>
  );
}

function PickSongsDemo() {
  return (
    <div className="flex w-full flex-col gap-2">
      <SongRow
        action={<Plus size={24} strokeWidth={4} />}
        artist="The Weeknd"
        hue={palette.coral}
        time="3:20"
        title="Blinding Lights"
      />
      <SongRow
        action={<Check size={24} strokeWidth={4} />}
        artist="Olivia Rodrigo"
        hue={palette.teal}
        time="2:58"
        title="good 4 u"
      />
      <SongRow
        action={<Plus size={24} strokeWidth={4} />}
        artist="Dua Lipa"
        hue={palette.golden}
        time="3:23"
        title="Levitating"
      />
    </div>
  );
}

function SongRow({
  action,
  artist,
  hue,
  time,
  title,
}: {
  action: ReactNode;
  artist: string;
  hue: string;
  time: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-white px-3 py-2.5">
      <AlbumArt color={hue} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black leading-tight">{title}</p>
        <p className="truncate text-xs font-medium leading-tight text-text-secondary">
          {artist}
        </p>
      </div>
      <span className="font-mono text-xs font-black text-text-secondary">
        {time}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-section-teal [&>svg]:h-4 [&>svg]:w-4">
        {action}
      </span>
    </div>
  );
}

function BracketDemo() {
  return <BracketVisual className="w-full max-w-[300px]" />;
}

function JudgeDemo() {
  return (
    <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5">
      <JudgeSong
        color={palette.coral}
        labelColor={palette.teal}
        seed="A"
        title="Heat Waves"
      />
      <span className="rounded-full bg-black px-3 py-1.5 text-[22px] font-black italic text-white">
        VS
      </span>
      <JudgeSong
        color={palette.lavender}
        labelColor={palette.golden}
        seed="B"
        title="Anti-Hero"
      />
    </div>
  );
}

function JudgeSong({
  color,
  labelColor,
  seed,
  title,
}: {
  color: string;
  labelColor: string;
  seed: string;
  title: string;
}) {
  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center rounded-xl border-2 border-black p-3 text-center"
      style={{ backgroundColor: color }}
    >
      <Vinyl color={labelColor} size={60} />
      <p className="mt-2 max-w-full text-[13px] font-black leading-tight">
        {title}
      </p>
      <p className="mt-2 text-[11px] font-black text-text-secondary">
        {seed} &middot; SEED {seed === "A" ? 2 : 5}
      </p>
    </div>
  );
}

function BracketVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 300 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M74 28H100V53H124" stroke={palette.ink} strokeWidth="1.5" />
      <path d="M74 78H100V53H124" stroke={palette.ink} strokeWidth="1.5" />
      <path d="M74 128H100V153H124" stroke={palette.ink} strokeWidth="1.5" />
      <path d="M74 178H100V153H124" stroke={palette.ink} strokeWidth="1.5" />
      <path d="M194 53H220V103H244" stroke={palette.ink} strokeWidth="1.5" />
      <path d="M194 153H220V103H244" stroke={palette.ink} strokeWidth="1.5" />
      <circle r="4" fill={palette.ink}>
        <animateMotion
          dur="4s"
          path="M74 28H100V53H124H194H220V103H244"
          repeatCount="indefinite"
        />
      </circle>
      {[
        { label: "A1", y: 10, color: palette.coral },
        { label: "B1", y: 60, color: palette.teal },
        { label: "A2", y: 110, color: palette.coral },
        { label: "B2", y: 160, color: palette.teal },
      ].map((item) => (
        <g key={item.label}>
          <rect
            fill={item.color}
            height="36"
            rx="8"
            stroke={palette.ink}
            strokeWidth="1.5"
            width="70"
            x="4"
            y={item.y}
          />
          <text
            fill={palette.ink}
            fontFamily="Inter, sans-serif"
            fontSize="13"
            fontWeight="800"
            textAnchor="middle"
            x="39"
            y={item.y + 23}
          >
            {item.label}
          </text>
        </g>
      ))}
      <BracketNode
        label="SF1"
        x={124}
        y={35}
        width={70}
        color={palette.golden}
      />
      <BracketNode
        label="SF2"
        x={124}
        y={135}
        width={70}
        color={palette.golden}
      />
      <BracketNode
        label="WINNER"
        x={244}
        y={82}
        width={52}
        color={palette.lavender}
        fontSize={9}
      />
    </svg>
  );
}

function BracketNode({
  color,
  fontSize = 13,
  label,
  width,
  x,
  y,
}: {
  color: string;
  fontSize?: number;
  label: string;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <g>
      <rect
        fill={color}
        height="36"
        rx="8"
        stroke={palette.ink}
        strokeWidth="1.5"
        width={width}
        x={x}
        y={y}
      />
      <text
        fill={palette.ink}
        fontFamily="Inter, sans-serif"
        fontSize={fontSize}
        fontWeight="800"
        textAnchor="middle"
        x={x + width / 2}
        y={y + 23}
      >
        {label}
      </text>
    </g>
  );
}

function Vinyl({ color, size = 88 }: { color: string; size?: number }) {
  return (
    <svg
      className="home-vinyl"
      height={size}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" fill={palette.ink} r="49" />
      {[44, 38, 32, 26].map((radius) => (
        <circle
          key={radius}
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="#1A1A1A"
          strokeWidth="1"
        />
      ))}
      <circle
        cx="50"
        cy="50"
        fill={color}
        r="17"
        stroke={palette.ink}
        strokeWidth="2"
      />
      <circle cx="50" cy="50" fill={palette.ink} r="3" />
    </svg>
  );
}

function AlbumArt({ color }: { color: string }) {
  const patternId = color.includes("coral")
    ? "home-stripe-coral"
    : color.includes("teal")
      ? "home-stripe-teal"
      : "home-stripe-golden";

  return (
    <svg
      className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-black"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          height="8"
          id={patternId}
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
          width="8"
        >
          <line
            stroke={palette.ink}
            strokeOpacity="0.28"
            strokeWidth="2"
            x1="0"
            x2="0"
            y1="0"
            y2="8"
          />
        </pattern>
      </defs>
      <rect fill={color} height="64" width="64" />
      <rect fill={`url(#${patternId})`} height="64" width="64" />
      <circle cx="32" cy="32" fill={palette.ink} r="6" />
      <circle cx="32" cy="32" fill={color} r="2" />
    </svg>
  );
}

function HomeButton({
  children,
  onClick,
  size = "medium",
  variant = "light",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "medium" | "large";
  variant?: "light" | "dark";
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-black font-black uppercase tracking-wide cursor-pointer transition-[transform,box-shadow] duration-[120ms] ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 ${
        variant === "dark" ? "bg-black text-white" : "bg-white text-black"
      } ${
        size === "large"
          ? "px-8 py-[18px] text-lg [box-shadow:6px_6px_0_#0A0A0A] hover:[box-shadow:8px_8px_0_#0A0A0A] active:[box-shadow:2px_2px_0_#0A0A0A]"
          : "px-[22px] py-3 text-sm [box-shadow:3px_3px_0_#0A0A0A] hover:[box-shadow:4px_4px_0_#0A0A0A] active:[box-shadow:1px_1px_0_#0A0A0A]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Pill({
  children,
  className = "",
  color,
}: {
  children: ReactNode;
  className?: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-black rounded-full px-4 py-1.5 text-[13px] font-black uppercase tracking-wider ${className}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

function FloatingShape({
  className,
  color,
  type,
}: {
  className: string;
  color: string;
  type: "circle" | "star";
}) {
  return (
    <DecorativeShape
      className={`home-float absolute pointer-events-none ${className}`}
      color={color}
      type={type}
    />
  );
}

function DecorativeShape({
  className,
  color,
  type,
}: {
  className: string;
  color: string;
  type: "circle" | "diamond" | "star";
}) {
  if (type === "circle") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          fill={color}
          r="47"
          stroke={palette.ink}
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (type === "diamond") {
    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          fill={color}
          height="54"
          stroke={palette.ink}
          strokeWidth="2"
          transform="rotate(45 50 50)"
          width="54"
          x="23"
          y="23"
        />
      </svg>
    );
  }

  const points = Array.from({ length: 16 })
    .map((_, index) => {
      const radius = index % 2 === 0 ? 48 : 22;
      const angle = (index / 16) * Math.PI * 2 - Math.PI / 2;
      return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        fill={color}
        points={points}
        stroke={palette.ink}
        strokeWidth="2"
      />
    </svg>
  );
}

export { HomePage };
