import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_LIMIT } from "@/constants/utils";

export const useSerieStore = defineStore("serie", () => {

  const filterKinds = ref<string[]>([]);

  const filterPlatforms = ref<string[]>([]);

  const filterLimit = ref(DEFAULT_LIMIT);

  const filterTitle = ref<string>();

  return { 
    filterKinds, 
    filterLimit, 
    filterPlatforms,
    filterTitle,
  };
});