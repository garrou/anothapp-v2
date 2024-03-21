import { useSnackbarStore } from "@/stores/snackbar";

export function useSnackbar() {

    const { setError, setMessage } = useSnackbarStore();
  
    const showError = (err: Error) => {
      setError(err);
    }
  
    const showMessage = (msg: string) => {
      setMessage(msg);
    }
  
    return { showError, showMessage };
}