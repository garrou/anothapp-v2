import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore("history", () => {
    const month = ref(0);

    return {
        month
    };
});
