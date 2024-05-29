import { ref } from "vue";
import { defineStore } from "pinia";

export const useFavoriteStore = defineStore("favorite", () => {
  
  const deleted = ref(0);

  return { deleted }
});