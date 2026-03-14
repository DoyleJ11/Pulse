import { create } from "zustand";

interface AuthState {
  token: string;
  username: string;
  role: string;
  userId?: string;
  setAuth: (
    newToken: string,
    newUsername: string,
    newRole: string,
    newUserId?: string,
  ) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: "",
  username: "",
  role: "",

  setAuth: (
    newToken: string,
    newUsername: string,
    newRole: string,
    newUserId?: string,
  ) =>
    set({
      token: newToken,
      username: newUsername,
      role: newRole,
      userId: newUserId,
    }),
}));

export { useAuthStore };
