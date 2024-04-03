import { useSnackbarStore } from "@/stores/snackbar";

export function useSnackbar() {

    const { setError, setInfo, setSuccess } = useSnackbarStore();

    const showError = (err: Error | string) => {
        if (typeof err === "string")
            setError({ message: err } as Error)
        else
            setError(err);
    }

    const showSuccess = (msg: string) => {
        setSuccess(msg);
    }

    const showInfo = (msg: string) => {
        setInfo(msg);
    }

    return { showError, showInfo, showSuccess };
}