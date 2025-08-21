import { ref } from "vue";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", () => {

  const confirmModal = ref(false);

  return { confirmModal };
});