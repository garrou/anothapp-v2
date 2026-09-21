import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSeason } from "./season";
import { PAGE_WITHOUT_BOTTOM_NAVBAR } from "@/constants/menus";

const pendingInvites = ref(0);
let watching = false;

export function usePendingWatchTogetherInvites() {
    const route = useRoute();
    const { getPendingWatchedWith } = useSeason();

    if (!watching) {
        watching = true;

        watch(
            () => !!route.name && !PAGE_WITHOUT_BOTTOM_NAVBAR.includes(route.name as string),
            async (visible) => {
                if (!visible) return;
                const invites = await getPendingWatchedWith();
                pendingInvites.value = invites.length;
            },
            { immediate: true }
        );
    }
    return pendingInvites;
}
