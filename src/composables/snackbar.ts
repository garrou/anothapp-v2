import { useSnackbarStore } from "@/stores/snackbar";
import { storeToRefs } from "pinia";

export function useSnackbar() {

    const { message, subject } = storeToRefs(useSnackbarStore());
  
    const setError = (err: Error) => {
      subject.value = "Error";
      message.value = err.message;
    }
  
    const setMessage = (msg: string) => {
      subject.value = "Message";
      message.value = msg;
    }
  
    return { message, subject, setError, setMessage };
}