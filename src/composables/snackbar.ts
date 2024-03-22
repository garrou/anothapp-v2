import { useSnackbarStore } from "@/stores/snackbar";

export function useSnackbar() {

    const { setError, setMessage } = useSnackbarStore();

    const showError = (err: Error | string) => {
        if (typeof err === "string")
            setError({ message: err } as Error)
        else
            setError(err);
    }

    const showSuccess = (msg: string) => {
        setMessage(msg);
    }

    return { showError, showSuccess };
}