import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Role } from "../types/sharedTypes";

interface AuthState {
  name: string;
  role: Role;
  userId: string;
  setAuth: (newName: string, newRole: Role, newUserId: string) => void;
  setRole: (newRole: Role) => void;
  // Clears role + userId but preserves the user's display name so the
  // landing page can autofill it next time.
  clearSession: () => void;
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
      setRole: (newRole: Role) => set({ role: newRole }),
      clearSession: () => set({ role: null, userId: "" }),
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
