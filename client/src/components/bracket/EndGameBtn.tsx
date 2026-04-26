import { socket } from "../../utils/socket";
import { useState } from "react";

export function EndGameBtn() {
  const [showModal, setShowModal] = useState(false);

  const confirmEndGame = () => {
    socket.emit("endGame");
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-100 bg-bg-cream flex flex-col gap-6 border-2 border-black p-6 rounded-2xl text-center shadow-[6px_6px_0_#0A0A0A]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl font-black text-text-primary">
              End the game for everyone?
            </h1>
            <p className="text-sm text-text-primary/60">
              Anyone still playing will be sent to the post-game screen.
            </p>
            <div className="flex gap-4 justify-center items-center">
              <button
                className="bg-bg-cream text-black border-2 border-black px-4 py-2 uppercase font-black cursor-pointer rounded-2xl shadow-[3px_3px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0A0A0A]"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#FF7B6B] text-black border-2 border-black px-4 py-2 uppercase font-black cursor-pointer rounded-2xl shadow-[3px_3px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0A0A0A]"
                onClick={confirmEndGame}
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FFD952] text-black border-2 border-black px-4 py-2 uppercase font-black cursor-pointer rounded-2xl shadow-[4px_4px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#0A0A0A]"
        >
          END GAME
        </button>
      </div>
    </>
  );
}
