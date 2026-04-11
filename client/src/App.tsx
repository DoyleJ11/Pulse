import { Routes, Route } from "react-router";
import { LandingPage } from "./components/lobby/LandingPage";
import { Lobby } from "./components/lobby/Lobby";
import { PickingFilterPage } from "./components/picking/PickingFilterPage"
import { useEffect } from "react";
import { socket } from "./utils/socket";
import { useRoomStore } from "./stores/roomStore";
import { useAuthStore } from "./stores/authStore";
import { BracketView } from "./components/bracket/BracketView";
import { BracketTest } from "./components/bracket/BracketTest";

function App() {
 const lobbyCode = useRoomStore((state) => state.code);
 const token = useAuthStore((state) => state.token);
 const userId = useAuthStore((state) => state.userId);
 const name = useAuthStore((state) => state.name);
 const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (lobbyCode && userId) {
      socket.on("connect", () => {
        socket.emit("joinRoom", {
          id: userId,
          code: lobbyCode,
          name: name,
          token: token,
          role: role,
        });
      })

      if (!socket.connected) {
        socket.connect()
      } else {
        socket.emit("joinRoom", {
          id: userId,
          code: lobbyCode,
          name: name,
          token: token,
          role: role,
        });
      }
    }

    return () => {
      socket.off("connect");
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lobby/:code" element={<Lobby />} />
      <Route path="/lobby/:code/picking" element={<PickingFilterPage />}/>
      <Route path="/lobby/:code/bracket" element={<BracketView />} />
      <Route path="/test" element={<BracketTest />} />
    </Routes>
  );
}

export default App;
