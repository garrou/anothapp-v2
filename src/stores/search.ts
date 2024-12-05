import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_LIMIT } from "@/constants/utils";

export const useSearchStore = defineStore("search", () => {

  const filterKinds = ref<string[]>([]);

  const filterPlatforms = ref<string[]>([]);

  const filterLimit = ref(DEFAULT_LIMIT);

  const filterYear = ref<number>();

  const filterTitle = ref<string>();

  const reset = () => {
    filterKinds.value = [];
    filterPlatforms.value = [];
    filterLimit.value = DEFAULT_LIMIT;
    filterYear.value = undefined;
    filterTitle.value = undefined;
  }

  const hasChanges = (): boolean => !!filterKinds.value.length 
    || !!filterPlatforms.value.length
    || filterLimit.value !== DEFAULT_LIMIT
    || !!filterYear.value 
    || !!filterTitle.value;

  return { 
    filterKinds, 
    filterLimit, 
    filterPlatforms,
    filterTitle,
    filterYear,
    hasChanges,
    reset
  };
});