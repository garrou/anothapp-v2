import { ref } from "vue";
import { defineStore } from "pinia";
import type { Kind } from "@/models/serie";

/** Global reference list of series kinds/genres. */
export const useKindsStore = defineStore("kinds", () => {

    const kinds = ref<Kind[]>([]);
    const loaded = ref(false);

    const setAll = (list: Kind[]): void => {
        kinds.value = list;
        loaded.value = true;
    }

    const reset = (): void => {
        kinds.value = [];
        loaded.value = false;
    }

    return { kinds, loaded, setAll, reset };
});
