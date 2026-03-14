import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";

function Lobby() {
  const username = useAuthStore((state) => state.username);
  const role = useAuthStore((state) => state.role);
  const playerList = useRoomStore((state) => state.players);
  const lobbyCode = useRoomStore((state) => state.code);

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-600">{lobbyCode}</h1>
        <h1 className="text-3xl font-bold text-slate-600">{username}</h1>
        <h1 className="text-2xl font-bold text-slate-500">{role}</h1>
      </div>
    </div>
  );
}

export { Lobby };
