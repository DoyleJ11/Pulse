import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { DecorativeShape, FloatingShape } from "../home/DecorativeShape";
import { HomeButton } from "../home/HomeButton";
import { homePalette } from "../home/homePalette";
import { LiveBracketCard } from "../home/LiveBracketCard";
import { MarqueeStrip } from "../home/MarqueeStrip";
import { Pill } from "../home/Pill";
import { BracketDemo, JudgeDemo, PickSongsDemo } from "../home/StepDemos";
import { StepCard } from "../home/StepCard";
import { Nav } from "../ui/Nav";

const marqueeItems = [
  "BRING YOUR TASTE",
  "PICK 8 SONGS",
  "BUILD THE BRACKET",
  "JUDGE EACH MATCHUP",
  "CROWN A CHAMPION",
];

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
          color={homePalette.coral}
          className="left-[4%] top-[18%] h-24 w-24 lg:left-[6%] lg:top-[20%] lg:h-[90px] lg:w-[90px]"
        />
        <FloatingShape
          type="star"
          color={homePalette.golden}
          className="bottom-[13%] left-[8%] h-[70px] w-[70px]"
        />
        <FloatingShape
          type="circle"
          color={homePalette.lavender}
          className="bottom-[16%] right-[12%] h-[50px] w-[50px]"
        />
      </div>

      <div className="relative z-2 max-w-[1280px] my-0 mx-auto">
        <div className="grid gap-12 grid-cols-[1.25fr_1fr] items-center">
          <div>
            <div className="flex gap-2 mb-6">
              <Pill color={homePalette.lavender}>● 3-player party game</Pill>
              <Pill color={homePalette.golden}>No install</Pill>
            </div>

            <h1 className="text-[clamp(72px,10vw,148px)] mx-0 mt-0 mb-5 font-black uppercase leading-[0.92] tracking-tight">
              <span>Whose</span>
              <br />
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
                  homePalette.coral,
                  homePalette.teal,
                  homePalette.golden,
                  homePalette.lavender,
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
            <Pill color={homePalette.teal} className="mb-4">
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
            accent={homePalette.coral}
            body="Both players get 8 slots. Search, scroll, and stack your lineup: bangers only."
            demo={<PickSongsDemo />}
            number="01"
            title="Pick 8 songs"
          />
          <StepCard
            accent={homePalette.golden}
            body="16 songs get shuffled into a March-Madness-style bracket. Round 1 begins immediately."
            demo={<BracketDemo />}
            number="02"
            title="Build the bracket"
          />
          <StepCard
            accent={homePalette.teal}
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
            color={homePalette.golden}
            className="absolute -left-8 -top-8 h-36 w-36 lg:h-[140px] lg:w-[140px]"
          />
          <DecorativeShape
            type="diamond"
            color={homePalette.lavender}
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

export { HomePage };
