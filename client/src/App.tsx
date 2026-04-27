import { Routes, Route } from "react-router";
import { LandingPage } from "./components/lobby/LandingPage";
import { Lobby } from "./components/lobby/Lobby";
import { PickingFilterPage } from "./components/picking/PickingFilterPage";
import { useEffect } from "react";
import { socket } from "./utils/socket";
import { useRoomStore } from "./stores/roomStore";
import { useAuthStore } from "./stores/authStore";
import { useTokenStore } from "./stores/tokenStore";
import { BracketView } from "./components/bracket/BracketView";
import { PostGame } from "./components/postgame/PostGame";

function App() {
  const lobbyCode = useRoomStore((state) => state.code);
  const setPlayers = useRoomStore((state) => state.setPlayers);
  const setHostId = useRoomStore((state) => state.setHostId);
  const token = useTokenStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const onConnect = () => {
      if (lobbyCode && userId) {
        socket.emit("joinRoom", {
          id: userId,
          code: lobbyCode,
          name: name,
          token: token,
          role: role,
        });
      }
    };

    const onDisconnect = () => {
      console.log(`user has disconnected: ${userId}`);
    };

    const onRoomState = ({
      users,
      hostId,
    }: {
      users: Parameters<typeof setPlayers>[0];
      hostId: string;
    }) => {
      setPlayers(users);
      setHostId(hostId);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("roomState", onRoomState);

    if (lobbyCode && userId) {
      if (!socket.connected) {
        socket.connect();
      } else {
        // Already connected — fire joinRoom now (the connect listener won't fire again).
        onConnect();
      }
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("roomState", onRoomState);
    };
  }, [lobbyCode, userId, name, token, role, setPlayers, setHostId]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lobby/:code" element={<Lobby />} />
      <Route path="/lobby/:code/picking" element={<PickingFilterPage />} />
      <Route path="/lobby/:code/bracket" element={<BracketView />} />
      <Route path="/lobby/:code/postgame" element={<PostGame />} />
    </Routes>
  );
}

export default App;
