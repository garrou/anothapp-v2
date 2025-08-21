import { defineStore } from "pinia";
import { reactive } from 'vue';

export const useScrollStore = defineStore("scroll", () => {

    const positions: Record<string, number> = reactive({});

    const saveScrollPosition = (path: string, position: number) => {
        positions[path] = position;
    }

    const scrollToPosition = (path: string) => {
        const scrollY = positions[path];
        if (scrollY) {
            window.scrollTo(0, scrollY);
        }
    }

    return {
        saveScrollPosition,
        scrollToPosition
    }
});