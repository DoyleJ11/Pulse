import { Nav } from "../ui/Nav";
import { HomeButton } from "../home/HomeButton";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { DecorativeShape, FloatingShape } from "../home/DecorativeShape";
import { useState } from "react";
import { createRoom, joinRoom } from "../../services/api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";
import { useTokenStore } from "../../stores/tokenStore";
import { useToastStore } from "../../stores/toastStore";

const palette = {
  coral: "var(--color-section-coral)",
  teal: "var(--color-section-teal)",
  golden: "var(--color-section-golden)",
  lavender: "var(--color-section-lavender)",
  ink: "var(--color-text-primary)",
};

export function LobbyCreation() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPlay = () => navigate("/play");

  const scrollToHow = () => {
    navigate("/");
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
      <HeroSection goHome={goHome} />
    </main>
  );
}

function HeroSection({ goHome }: { goHome: () => void }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const persistedName = useAuthStore((state) => state.name);
  const setToken = useTokenStore((state) => state.setToken);
  const setRoomCode = useRoomStore((state) => state.setCode);
  const addError = useToastStore((state) => state.addError);

  const [name, setName] = useState(persistedName);
  const [code, setCode] = useState("");

  const nameIsEmpty = name.length === 0;
  const codeIsEmpty = code.length !== 6;

  const initial = nameIsEmpty ? "?" : name[0];

  const handleJoin = async () => {
    try {
      const response = await joinRoom(name, code);
      setAuth(response.name, response.role, response.id);
      setToken(response.jwt);
      setRoomCode(response.code);
      navigate(`/lobby/${response.code}`);
    } catch (error) {
      addError(
        error,
        "Could not join the room. Please check the code and try again.",
      );
    }
  };

  const handleCreate = async () => {
    try {
      const response = await createRoom(name);
      setAuth(response.name, response.role, response.id);
      setToken(response.jwt);
      setRoomCode(response.code);
      navigate(`/lobby/${response.code}`);
    } catch (error) {
      addError(error, "Could not create the room. Please try again.");
    }
  };

  return (
    <section className="pt-5 px-10 pb-20 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <FloatingShape
          type="circle"
          color={palette.coral}
          className="top-[12%] left-[6%] h-22 w-22"
        />
        <FloatingShape
          type="diamond"
          color={palette.teal}
          className="top-[22%] right-[8%] h-15 w-15"
        />
        <FloatingShape
          type="circle"
          color={palette.lavender}
          className="top-[78%] right-[12%] h-12.5 w-12.5"
        />
        <FloatingShape
          type="star"
          color={palette.golden}
          className="top-[70%] left-[8%] h-17.5 w-17.5"
        />
      </div>

      <div className="relative z-2 max-w-[1080px] my-0 mx-auto">
        {/* Add fade up anim to div below */}
        <div className="mb-12">
          <HomeButton size="medium" onClick={goHome}>
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={3} />
            Back
          </HomeButton>
          <div className="flex items-end justify-between gap-6 flex-wrap mt-6">
            <div>
              <h1 className="text-[clamp(64px,9vw,112px)] m-0 font-black tracking-tight leading-[0.92]">
                <span>Grab a</span>
                <br></br>
                <span>room.</span>
              </h1>
            </div>
            <p className="text-lg leading-[1.5] text-text-primary/60 m-0 max-w-[360px]">
              <span>
                Start a fresh lobby and share the code with two friends — or
                drop in with a code someone already sent you.
              </span>
            </p>
          </div>
        </div>

        {/* Add fade up anim to div below + 0.1s animation delay */}
        <div className="bg-white p-7 mb-6 shadow-[6px_6px_0_#0A0A0A] border-2 border-text-primary rounded-3xl">
          <label className="block font-black text-sm tracking-widest uppercase text-text-primary/60 mb-3">
            <span>Your Name</span>
          </label>
          <div className="flex gap-3.5 items-center">
            <div
              className="w-14 h-14 shrink-0 border-2 border-text-primary rounded-2xl flex items-center justify-center font-black text-2xl"
              style={{ backgroundColor: palette.coral }}
            >
              {initial}
            </div>
            <input
              className="w-full text-lg font-bold text-text-primary py-4.5 px-5.5 border-2 border-text-primary rounded-2xl bg-white outline-none transition-[translate,box-shadow] duration-120 ease-[ease] focus:-translate-px focus:shadow-[3px_3px_0_#0A0A0A]"
              placeholder="What should we call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Add 0.2s animation delay */}
          <div
            className="p-8 flex flex-col gap-4 min-h-[400px] relative overflow-hidden transition-[translate] duration-200 ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 transform-none shadow-[6px_6px_0_#0A0A0A] border-2 border-text-primary rounded-3xl"
            style={{ backgroundColor: palette.coral }}
          >
            <div className="absolute -top-5 -right-5 w-30 h-30 opacity-60">
              {/* Star SVG */}
              <DecorativeShape
                type="star"
                color={palette.golden}
                className=""
              />
            </div>
            <div className="relative z-2">
              <div className="flex justify-between items-center mb-4 uppercase">
                <span className="text-sm font-bold font-mono">Option A</span>
                <span className="w-3.5 h-3.5 rounded-full bg-text-primary"></span>
              </div>
              <h2 className="text-[64px] mx-0 mt-0 mb-3 font-black tracking-tight leading-[0.92] uppercase">
                <span>CREATE</span>
                <br></br>
                <span>LOBBY</span>
              </h2>
              <p className="leading-[1.5] font-medium text-text-primary mx-0 mt-0 mb-6">
                <span>
                  Spin up a fresh room. You'll get a 6-letter code to share with
                  your crew.
                </span>
              </p>
            </div>

            <div className="flex-1"></div>

            <div className="relative z-2 flex flex-col gap-2.5">
              {/* Add cursor not allowed if name not filled in */}
              <HomeButton
                size="large"
                variant="dark"
                onClick={() => handleCreate()}
                disabled={nameIsEmpty}
              >
                <span className="uppercase">CREATE LOBBY</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
              </HomeButton>
            </div>
          </div>

          <div
            className="p-8 flex flex-col gap-4 min-h-[400px] relative overflow-hidden transition-[translate] duration-200 ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 transform-none shadow-[6px_6px_0_#0A0A0A] border-2 border-text-primary rounded-3xl"
            style={{ backgroundColor: palette.teal }}
          >
            <div className="absolute -bottom-5 -left-5 w-28 h-28 opacity-60">
              {/* Star SVG */}
              <DecorativeShape
                type="diamond"
                color={palette.lavender}
                className=""
              />
            </div>
            <div className="relative z-2">
              <div className="flex justify-between items-center mb-4 uppercase">
                <span className="text-sm font-bold font-mono">Option B</span>
                <span className="w-3.5 h-3.5 rounded-full bg-text-primary"></span>
              </div>
              <h2 className="text-[64px] mx-0 mt-0 mb-3 font-black tracking-tight leading-[0.92] uppercase">
                <span>JOIN</span>
                <br></br>
                <span>LOBBY</span>
              </h2>
              <p className="text-sm leading-[1.5] font-medium text-text-primary mx-0 mt-0 mb-5">
                <span>Got a code from a friend? Drop it in below.</span>
              </p>
              <label className="block font-black text-xs tracking-widest uppercase text-text-primary/60 mb-2">
                <span>LOBBY CODE</span>
              </label>
              <input
                className="font-mono text-2xl tracking-[0.35em] uppercase text-center w-full px-5.5 py-4.5 font-bold border-2 border-text-primary rounded-2xl bg-white text-text-primary outline-none transition-[translate,box-shadow] duration-120 ease-[ease] focus:-translate-px focus:shadow-[3px_3px_0_#0A0A0A]"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="flex-1"></div>

            <div className="relative z-2 flex flex-col gap-2.5">
              {/* Add cursor not allowed if name not filled in */}
              <HomeButton
                size="large"
                variant="dark"
                onClick={() => handleJoin()}
                disabled={nameIsEmpty || codeIsEmpty}
              >
                <span className="uppercase">JOIN LOBBY</span>
                <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
              </HomeButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
