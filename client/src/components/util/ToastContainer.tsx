import { useToastStore } from "../../stores/toastStore";

export function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts);
    const removeToast = useToastStore((state) => state.removeToast);

    return (
        <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded shadow-lg text-white ${
                        toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'
                    }`}
                    onClick={() => removeToast(toast.id)}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    )
}