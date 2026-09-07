import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/user";

/** The current user's accepted friends list. */
export const useFriendsStore = defineStore("friends", () => {

    const friends = ref<User[]>([]);
    const loaded = ref(false);

    const setAll = (list: User[]): void => {
        friends.value = list;
        loaded.value = true;
    }

    const reset = (): void => {
        friends.value = [];
        loaded.value = false;
    }

    return { friends, loaded, setAll, reset };
});
