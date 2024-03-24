import { ref } from "vue";
import { defineStore } from "pinia";

export const useFavoriteStore = defineStore("favorite", () => {
  
  const deleted = ref(0);

  const increment = () => {
    deleted.value++;
  }

  return { deleted, increment }
});