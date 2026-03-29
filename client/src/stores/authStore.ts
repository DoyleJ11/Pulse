import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Role } from "../types/sharedTypes";

interface AuthState {
  token: string;
  name: string;
  role: Role;
  userId: string;
  setAuth: (
    newToken: string,
    newName: string,
    newRole: Role,
    newUserId: string,
  ) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      name: "",
      role: null,
      userId: "",

      setAuth: (
        newToken: string,
        newName: string,
        newRole: Role,
        newUserId: string,
      ) =>
        set({
          token: newToken,
          name: newName,
          role: newRole,
          userId: newUserId,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        name: state.name,
        role: state.role,
        userId: state.userId,
      }),
    },
  ),
);

export { useAuthStore };
