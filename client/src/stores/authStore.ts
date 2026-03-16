import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string;
  name: string;
  role: string;
  userId: string;
  setAuth: (
    newToken: string,
    newName: string,
    newRole: string,
    newUserId: string,
  ) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      name: "",
      role: "",
      userId: "",

      setAuth: (
        newToken: string,
        newName: string,
        newRole: string,
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
