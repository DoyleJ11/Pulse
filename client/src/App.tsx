import { Routes, Route } from "react-router";
import { HomePage } from "./components/lobby/HomePage";
import { LandingPage } from "./components/lobby/LandingPage";
import { Lobby } from "./components/lobby/Lobby";
import { PickingFilterPage } from "./components/picking/PickingFilterPage";
import { useEffect, useRef } from "react";
import { socket } from "./utils/socket";
import { useRoomStore } from "./stores/roomStore";
import { useAuthStore } from "./stores/authStore";
import { useTokenStore } from "./stores/tokenStore";
import { BracketView } from "./components/bracket/BracketView";
import { PostGame } from "./components/postgame/PostGame";
import { useToastStore } from "./stores/toastStore";
import { useAudioStore } from "./stores/audioStore";

function App() {
  const lobbyCode = useRoomStore((state) => state.code);
  const setPlayers = useRoomStore((state) => state.setPlayers);
  const setHostId = useRoomStore((state) => state.setHostId);
  const token = useTokenStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
  const addToast = useToastStore((state) => state.addToast);
  const addError = useToastStore((state) => state.addError);
  const audioError = useAudioStore((state) => state.error);
  const wasDisconnectedRef = useRef(false);

  useEffect(() => {
    if (audioError) {
      addToast(audioError, "error");
    }
  }, [audioError, addToast]);

  useEffect(() => {
    const onConnect = () => {
      if (wasDisconnectedRef.current) {
        addToast("Connection restored.", "success");
        wasDisconnectedRef.current = false;
      }

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
      if (lobbyCode && userId) {
        wasDisconnectedRef.current = true;
        addToast("Connection lost. Trying to reconnect...", "warning");
      }
    };

    const onConnectError = () => {
      addToast("Could not connect to the game server.", "error");
    };

    const onSocketError = (error: unknown) => {
      addError(error, "Something went wrong with the live room connection.");
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
    socket.on("connect_error", onConnectError);
    socket.on("error", onSocketError);
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
      socket.off("connect_error", onConnectError);
      socket.off("error", onSocketError);
      socket.off("roomState", onRoomState);
    };
  }, [lobbyCode, userId, name, token, role, setPlayers, setHostId, addToast, addError]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play" element={<LandingPage />} />
      <Route path="/lobby/:code" element={<Lobby />} />
      <Route path="/lobby/:code/picking" element={<PickingFilterPage />} />
      <Route path="/lobby/:code/bracket" element={<BracketView />} />
      <Route path="/lobby/:code/postgame" element={<PostGame />} />
    </Routes>
  );
}

export default App;
