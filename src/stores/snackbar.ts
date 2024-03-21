import { ref } from "vue"
import { defineStore } from "pinia"
import type { SnakbarMessage } from "@/models/snackbar";

export const useSnackbarStore = defineStore("snackbar", () => {
  
  const message = ref<SnakbarMessage>();

  const setError = (err: Error) => {
    message.value = {
      color: "red",
      message: err.message,
      subject: "Error"
    };
  }

  const setMessage = (msg: string) => {
    message.value = {
      color: "green",
      message: msg,
      subject: "Ok"
    };
  }

  return { message, setError, setMessage };
});