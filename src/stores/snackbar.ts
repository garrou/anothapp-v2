import { ref } from "vue"
import { defineStore } from "pinia"

export const useSnackbarStore = defineStore("snackbar", () => {
  
  const message = ref("");
  const subject = ref("");

  const setError = (err: Error) => {
    subject.value = "Error";
    message.value = err.message;
  }

  const setMessage = (msg: string) => {
    subject.value = "Message";
    message.value = msg;
  }

  return { message, subject, setError, setMessage };
});