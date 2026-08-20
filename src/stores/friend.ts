import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/user";

export const useFriendStore = defineStore("friend", () => {

    const friend = ref<User>();

    const setFriend = (user: User) => {
        friend.value = user;
    }

    const reset = () => {
        friend.value = undefined;
    }

    return { friend, reset, setFriend };
});
