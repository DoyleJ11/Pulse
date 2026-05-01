import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";
import { socket } from "../../utils/socket";
import { startPicking } from "../../services/api";
import { useNavigate } from "react-router";
import { useTokenStore } from "../../stores/tokenStore";
import { type Status } from "../../types/sharedTypes";
import { useToastStore } from "../../stores/toastStore";

function Lobby() {
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
    // roomState is handled globally in App.tsx — don't duplicate the listener here.

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
    <div>
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-600">{lobbyCode}</h1>
        <h1 className="text-3xl font-bold text-slate-600">{name}</h1>
        <h1 className="text-2xl font-bold text-slate-500">{role}</h1>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">Player List:</h1>
          {playerList && (
            <ul className="text-xl font-semibold p-4">
              {playerList.map((player, index) => (
                <li key={index}>
                  {index + 1}. {player.name}: {player.role}{" "}
                  {player.id === hostId ? "HOST" : ""}
                </li>
              ))}
            </ul>
          )}

          {userId === hostId && (
            <button
              className="border p-4 rounded-lg cursor-pointer"
              onClick={handleStartPicking}
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { Lobby };
