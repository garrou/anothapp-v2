import { ref } from "vue"
import { defineStore } from "pinia"
import type { SnakbarMessage } from "@/models/snackbar";

export const useSnackbarStore = defineStore("snackbar", () => {
  
  const message = ref<SnakbarMessage>();

  const setError = (err: Error) => {
    message.value = {
      color: "error",
      message: err.message,
      subject: "Erreur"
    };
  }

  const setMessage = (msg: string) => {
    message.value = {
      color: "success",
      message: msg,
      subject: "Succès"
    };
  }

  return { message, setError, setMessage };
});