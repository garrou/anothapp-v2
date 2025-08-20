import { defineStore } from "pinia";
import { reactive } from 'vue';

export const useScrollStore = defineStore("scroll", () => {

    const positions: Record<string, number> = reactive({});

    return {
        positions
    }
});