import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useFriend } from "./friend";
import { FriendStatus } from "@/types/types";
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";

const pendingRequests = ref(0);
let watching = false;

export function usePendingFriendRequests() {
    const route = useRoute();
    const { getFriends } = useFriend();

    if (!watching) {
        watching = true;

        watch(
            () => !!route.name && !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string),
            async (visible) => {
                if (!visible) return;
                const { received } = await getFriends(FriendStatus.Received);

                if (received) { 
                    pendingRequests.value = received.length;
                }
            },
            { immediate: true }
        );
    }
    return pendingRequests;
}
