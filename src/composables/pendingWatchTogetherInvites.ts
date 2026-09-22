import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSeason } from "./season";
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";

const pendingInvites = ref(0);
let watching = false;

export function usePendingWatchTogetherInvites() {
    const route = useRoute();
    const { getWatchedWith } = useSeason();

    const refresh = async () => {
        const invites = await getWatchedWith("pending");
        pendingInvites.value = invites.length;
    }

    if (!watching) {
        watching = true;

        watch(
            () => !!route.name && !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string),
            async (visible) => {
                if (!visible) return;
                await refresh();
            },
            { immediate: true }
        );
    }
    // exposes refresh so callers that just resolved an invite (accept/decline) can update
    // the shared badge count immediately, instead of waiting for the next route-visibility change
    return { pendingInvites, refresh };
}
