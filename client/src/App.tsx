import { Routes, Route, useLocation, useNavigate } from "react-router";
import { HomePage } from "./components/lobby/HomePage";
import { LobbyCreation } from "./components/lobby/LobbyCreation";
import { Lobby } from "./components/lobby/Lobby";
import { PickingFilterPage } from "./components/picking/PickingFilterPage";
import { useEffect, useRef } from "react";
import { socket } from "./utils/socket";
import { useRoomStore } from "./stores/roomStore";
import { useAuthStore } from "./stores/authStore";
import type { Role } from "./types/sharedTypes";
import { useTokenStore } from "./stores/tokenStore";
import { BracketView } from "./components/bracket/BracketView";
import { PostGame } from "./components/postgame/PostGame";
import { useToastStore } from "./stores/toastStore";
import { useAudioStore } from "./stores/audioStore";
import { fetchRoomState } from "./services/api";
import { useSongStore } from "./stores/songStore";
import type { Status } from "./types/sharedTypes";
import { consumeIntentionalDisconnect } from "./utils/socketIntent";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const lobbyCode = useRoomStore((state) => state.code);
  const setCode = useRoomStore((state) => state.setCode);
  const setPlayers = useRoomStore((state) => state.setPlayers);
  const setHostId = useRoomStore((state) => state.setHostId);
  const setStatus = useRoomStore((state) => state.setStatus);
  const clearRoom = useRoomStore((state) => state.clearRoom);
  const token = useTokenStore((state) => state.token);
  const clearToken = useTokenStore((state) => state.clearToken);
  const userId = useAuthStore((state) => state.userId);
  const name = useAuthStore((state) => state.name);
  const role = useAuthStore((state) => state.role);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setRole = useAuthStore((state) => state.setRole);
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearSongs = useSongStore((state) => state.clearSongs);
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
    if (!lobbyCode) return;

    if (!token) {
      clearSession();
      clearRoom();
      clearSongs();
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const roomState = await fetchRoomState(lobbyCode, token);
        if (cancelled) return;

        setCode(roomState.code);
        setAuth(
          roomState.currentUser.name,
          roomState.currentUser.role,
          roomState.currentUser.id,
        );
        setPlayers(roomState.players);
        setHostId(roomState.hostId);
        setStatus(roomState.status);
        navigate(getRoomPath(roomState.code, roomState.status, location.pathname), {
          replace: true,
        });
      } catch (error) {
        if (cancelled) return;

        clearSession();
        clearRoom();
        clearToken();
        clearSongs();
        addError(
          error,
          "Your saved room session could not be restored. Please join again.",
        );
        navigate("/", { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    lobbyCode,
    token,
    setCode,
    setAuth,
    setPlayers,
    setHostId,
    setStatus,
    clearSession,
    clearRoom,
    clearToken,
    clearSongs,
    addError,
    location.pathname,
    navigate,
  ]);

  useEffect(() => {
    const onConnect = () => {
      if (wasDisconnectedRef.current) {
        addToast("Connection restored.", "success");
        wasDisconnectedRef.current = false;
      }

      if (lobbyCode && userId) {
        socket.emit("joinRoom", {
          code: lobbyCode,
          token: token,
        });
      }
    };

    const onDisconnect = () => {
      if (consumeIntentionalDisconnect()) {
        wasDisconnectedRef.current = false;
        return;
      }

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
      const me = users.find((u) => u.id === userId);
      if (me) setRole(me.role as Role);
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
  }, [
    lobbyCode,
    userId,
    name,
    token,
    role,
    setPlayers,
    setHostId,
    setRole,
    addToast,
    addError,
  ]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play" element={<LobbyCreation />} />
      <Route path="/lobby/:code" element={<Lobby />} />
      <Route path="/lobby/:code/picking" element={<PickingFilterPage />} />
      <Route path="/lobby/:code/bracket" element={<BracketView />} />
      <Route path="/lobby/:code/postgame" element={<PostGame />} />
    </Routes>
  );
}

function getRoomPath(code: string, status: Status, currentPath: string) {
  if (status === "complete") {
    const bracketPath = `/lobby/${code}/bracket`;
    const postgamePath = `/lobby/${code}/postgame`;

    if (currentPath === bracketPath || currentPath === postgamePath) {
      return currentPath;
    }

    return postgamePath;
  }

  if (status === "picking") return `/lobby/${code}/picking`;
  if (status === "battling") return `/lobby/${code}/bracket`;

  return `/lobby/${code}`;
}

export default App;
