import { useNavigate } from "react-router";
import { Crown } from "lucide-react";
import { useRoomStore } from "../../stores/roomStore";

export function ViewChampionBtn() {
  const navigate = useNavigate();
  const lobbyCode = useRoomStore((state) => state.code);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={() => navigate(`/lobby/${lobbyCode}/postgame`)}
        className="flex items-center gap-2 bg-[#FFD952] text-black border-2 border-black px-4 py-2 uppercase font-black cursor-pointer rounded-2xl shadow-[4px_4px_0_#0A0A0A] transition-[transform,box-shadow,background-color] duration-[120ms] ease-in-out hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#0A0A0A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#0A0A0A]"
      >
        <Crown className="w-5 h-5 text-black fill-black" strokeWidth={0} />
        VIEW CHAMPION
      </button>
    </div>
  );
}
