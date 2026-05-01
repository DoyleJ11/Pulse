import { PermissionGuard } from "../util/PermissionGuard";
import { PlayerSongSelect } from "./PlayerSongSelect";
import { JudgeSelectView } from "./JudgeSelectView";
import { useSongStore } from "../../stores/songStore";
import { useRoomStore } from "../../stores/roomStore"
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { socket } from "../../utils/socket";

export function PickingFilterPage() {
    const clearSongs = useSongStore((state) => state.clearSongs);
    const setLockIn = useSongStore((state) => state.setLockIn);
    const lobbyCode = useRoomStore((state) => state.code);
    const navigate = useNavigate();

    // On submissionComplete - clear songs, set lockIn false, navigate all users to bracket
    useEffect(() => {
        socket.on("submissionComplete", () => {
            clearSongs();
            setLockIn(false);
            navigate(`/lobby/${lobbyCode}/bracket`);
        })

        return () => {
            socket.off("submissionComplete")
        }
    }, [clearSongs, lobbyCode, navigate, setLockIn])

return (
    <>
        <PermissionGuard allowedRoles={['player_a', 'player_b']}>
            <PlayerSongSelect />
        </PermissionGuard>
        <PermissionGuard allowedRoles={['judge', 'spectator']}>
            <JudgeSelectView code={lobbyCode} theme={null}/>
        </PermissionGuard>
    </>
)

}
