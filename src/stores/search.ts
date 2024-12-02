import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_LIMIT } from "@/constants/utils";

export const useSearchStore = defineStore("search", () => {

  const filterKinds = ref<string[]>([]);

  const filterPlatforms = ref<string[]>([]);

  const filterLimit = ref(DEFAULT_LIMIT);

  const filterYear = ref<number>();

  const filterTitle = ref<string>();

  return { 
    filterKinds, 
    filterLimit, 
    filterPlatforms,
    filterTitle,
    filterYear
  };
});