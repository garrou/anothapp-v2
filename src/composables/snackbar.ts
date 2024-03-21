import { useSnackbarStore } from "@/stores/snackbar";

export function useSnackbar() {

    const { setError, setMessage } = useSnackbarStore();
  
    const showError = (err: Error) => {
      setError(err);
    }
  
    const showSuccess = (msg: string) => {
      setMessage(msg);
    }
  
    return { showError, showSuccess };
}