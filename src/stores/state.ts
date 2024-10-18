import { ref } from "vue";
import { defineStore } from "pinia";

export const useStateStore = defineStore("state", () => {

  const confirmModal = ref(false);

  const counter = ref(0);

  return { confirmModal, counter };
});