import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useRoomStore } from "../../stores/roomStore";
import { socket } from "../../utils/socket";

function Lobby() {
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const playerList = useRoomStore((state) => state.players);
  const setPlayerList = useRoomStore((state) => state.setPlayers);
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
    socket.on("roomState", (data) => {
      setPlayerList(data);
    });

    socket.on("error", (errData) => {
      setErrorMessage(errData.message);
    });

    return () => {
      socket.off("roomState");
      socket.off("error");
    };
  }, [setPlayerList]);

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        {errorMessage && (
          <h1 className="text-2xl font-bold text-red-400">{errorMessage}</h1>
        )}
        <h1 className="text-3xl font-bold text-slate-600">{lobbyCode}</h1>
        <h1 className="text-3xl font-bold text-slate-600">{name}</h1>
        <h1 className="text-2xl font-bold text-slate-500">{role}</h1>
        <div>
          <h1 className="text-3xl font-bold">Player List:</h1>
          {playerList && (
            <ul className="text-xl font-semibold p-4">
              {playerList.map((player, index) => (
                <li key={index}>
                  {index + 1}. {player.name}: {player.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export { Lobby };
