import {type ReactNode} from "react";
import { useAuthStore } from "../../stores/authStore";


interface PermissionGuardProps {
    allowedRoles: Array<'player_a' | 'player_b' | 'judge' | 'spectator'>;
    children: ReactNode;
    fallback?: ReactNode;
}

export const PermissionGuard = ({ allowedRoles, children, fallback = null }: PermissionGuardProps) => {
    const role = useAuthStore((state) => state.role);

    if (role && allowedRoles.includes(role)) {
        return <>{children}</>
    }

    return <>{fallback}</>
}