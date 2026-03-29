import { PermissionGuard } from "../util/PermissionGuard";
import { PlayerSongSelect } from "./PlayerSongSelect";
import { SongSelectView } from "./SongSelectView";

export function PickingFilterPage() {

return (
    <>
        <PermissionGuard allowedRoles={['player_a', 'player_b']}>
            <PlayerSongSelect />
        </PermissionGuard>
        <PermissionGuard allowedRoles={['judge', 'spectator']}>
            <p>Only judges and spectators should be able to see this</p>
            <SongSelectView />
        </PermissionGuard>
    </>
)

}