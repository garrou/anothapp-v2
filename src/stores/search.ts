import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_LIMIT } from "@/constants/services";
import type { Kind, Platform } from "@/models/serie";

export const useSearchStore = defineStore("search", () => {

  const filterKinds = ref<Kind[]>([]);

  const filterPlatforms = ref<Platform[]>([]);

  const filterLimit = ref(DEFAULT_LIMIT);

  const filterTitle = ref<string>();

  const reset = () => {
    filterKinds.value = [];
    filterPlatforms.value = [];
    filterLimit.value = DEFAULT_LIMIT;
    filterTitle.value = undefined;
  }

  const hasChanges = (): boolean => !!filterKinds.value.length
    || !!filterPlatforms.value.length
    || filterLimit.value !== DEFAULT_LIMIT
    || !!filterTitle.value;

  const formatKinds = (): string|undefined => {
    return filterKinds.value.length ? filterKinds.value.map((kind) => kind.value).join(",") : undefined;
  }

  const formatPlatforms = (): string|undefined => {
    return filterPlatforms.value.length ? filterPlatforms.value.map((platform) => `${platform.id}`).join(",") : undefined;
  }

  return {
    filterKinds,
    filterLimit,
    filterPlatforms,
    filterTitle,
    formatKinds,
    formatPlatforms,
    hasChanges,
    reset
  };
});