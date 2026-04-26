import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Role } from "../types/sharedTypes";

interface AuthState {
  name: string;
  role: Role;
  userId: string;
  setAuth: (newName: string, newRole: Role, newUserId: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      name: "",
      role: null,
      userId: "",

      setAuth: (newName: string, newRole: Role, newUserId: string) =>
        set({
          name: newName,
          role: newRole,
          userId: newUserId,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        role: state.role,
        userId: state.userId,
      }),
    },
  ),
);

export { useAuthStore };
