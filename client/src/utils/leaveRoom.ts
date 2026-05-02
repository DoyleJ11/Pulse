import { useAuthStore } from "../stores/authStore";
import { useRoomStore } from "../stores/roomStore";
import { useSongStore } from "../stores/songStore";
import { useTokenStore } from "../stores/tokenStore";
import { socket } from "./socket";
import { markIntentionalDisconnect } from "./socketIntent";

function leaveCurrentRoom() {
  if (socket.connected) {
    markIntentionalDisconnect();
    socket.disconnect();
  }

  useAuthStore.getState().clearSession();
  useRoomStore.getState().clearRoom();
  useTokenStore.getState().clearToken();
  useSongStore.getState().clearSongs();
}

export { leaveCurrentRoom };
