import { ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_LIMIT } from "@/constants/utils";

export const useSerieStore = defineStore("serie", () => {

    const filterKinds = ref<string[]>([]);

    const filterPlatforms = ref<string[]>([]);

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

    return {
        filterKinds,
        filterLimit,
        filterPlatforms,
        filterTitle,
        hasChanges,
        reset
    };
});