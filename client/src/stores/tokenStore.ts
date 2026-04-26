import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TokenState {
  token: string;
  setToken: (newToken: string) => void;
  clearToken: () => void;
}

const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (newToken: string) => set({ token: newToken }),
      clearToken: () => set({ token: "" }),
    }),
    {
      name: "token-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);

export { useTokenStore };
