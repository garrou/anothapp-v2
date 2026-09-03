import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/user";

export const useUserStore = defineStore("user", () => {

    const profile = ref<User>();
    const loaded = ref(false);

    const set = (user: User): void => {
        profile.value = user;
        loaded.value = true;
    }

    const patch = (partial: Partial<User>): void => {
        if (profile.value) {
            profile.value = { ...profile.value, ...partial };
        }
    }

    const reset = (): void => {
        profile.value = undefined;
        loaded.value = false;
    }

    return { profile, loaded, set, patch, reset };
});
