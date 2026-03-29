import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";
import { socket } from "../../utils/socket";
import { startPicking } from "../../services/api";
import { useNavigate } from "react-router";

function Lobby() {
  const navigate = useNavigate();
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const playerList = useRoomStore((state) => state.players);
  const setPlayerList = useRoomStore((state) => state.setPlayers);
  const setHostId = useRoomStore((state) => state.setHostId);
  const hostId = useRoomStore((state) => state.hostId);
  const setStatus = useRoomStore((state) => state.setStatus);
  const lobbyCode = useRoomStore((state) => state.code);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (lobbyCode && name && !socket.connected) {
      socket.connect();
      socket.emit("joinRoom", {
        id: userId,
        code: lobbyCode,
        name: name,
        token: token,
        role: role,
      });
    }
  }, [lobbyCode, name, token, role, userId]);

  useEffect(() => {
    socket.on("roomState", ({ users, hostId }) => {
      setPlayerList(users);
      setHostId(hostId)
    });

    socket.on("error", (errData) => {
      setErrorMessage(errData.message);
    });

    socket.on("startPicking", ({ status }) => {
      setStatus(status)
      navigate(`/lobby/${lobbyCode}/picking`);
    })

    return () => {
      socket.off("roomState");
      socket.off("error");
      socket.off("startPicking")
    };
  }, [setPlayerList]);

  const handleStartPicking = async () => {
    await startPicking(lobbyCode, token);
  }

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        {errorMessage && (
          <h1 className="text-2xl font-bold text-red-400">{errorMessage}</h1>
        )}
        <h1 className="text-3xl font-bold text-slate-600">{lobbyCode}</h1>
        <h1 className="text-3xl font-bold text-slate-600">{name}</h1>
        <h1 className="text-2xl font-bold text-slate-500">{role}</h1>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">Player List:</h1>
          {playerList && (
            <ul className="text-xl font-semibold p-4">
              {playerList.map((player, index) => (
                <li key={index}>
                  {index + 1}. {player.name}: {player.role} {player.id === hostId ? "HOST" : ""} 
                </li>
              ))}
            </ul>
          )}

          {userId === hostId && (
            <button className="border p-4 rounded-lg cursor-pointer" onClick={handleStartPicking}>Start Game</button>
          )}
        </div>
      </div>
    </div>
  );
}

export { Lobby };
