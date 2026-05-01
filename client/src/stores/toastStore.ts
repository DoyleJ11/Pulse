import { create } from "zustand";

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string,
    message: string,
    type: ToastType,
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    addError: (error: unknown, fallback?: string) => void;
    removeToast: (id: string) => void;
}

function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return fallback;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type = 'error') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, {id, message, type}],
        }));

        // Auto remove after a few seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 3000);
    },
    addError: (error, fallback) => {
        const message = getErrorMessage(error, fallback);
        useToastStore.getState().addToast(message, "error");
    },
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export { getErrorMessage };
