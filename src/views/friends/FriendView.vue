<template>
    <div v-if="friend">
        <v-btn class="back-btn" :icon="BACK_ICON" variant="text" @click="goBack" />

        <div class="friend-hero">
            <v-avatar size="96" :color="friend.picture ? undefined : 'primary'">
                <v-img v-if="friend.picture" :src="friend.picture" alt="" />
                <span v-else class="text-h4 font-weight-bold">{{ friend.username.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div class="text-h6 font-weight-bold mt-3">{{ friend.username }}</div>
            <div v-if="friend.createdAt" class="text-caption text-medium-emphasis mt-1">
                Membre depuis <b>{{ formatMonthYear(friend.createdAt) }}</b>
            </div>
        </div>

        <v-card class="mb-4 mx-0 mx-sm-4" rounded="lg" flat>
            <v-row class="pa-4" no-gutters>
                <div class="flex-grow-1">
                    <div class="text-body-1">
                        Accepter ses invitations automatiquement
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                        Les invitations de {{ friend.username }} pour regarder une saison ensemble
                        seront acceptées automatiquement
                    </div>
                </div>

                <v-switch :model-value="autoAccept" color="primary" hide-details class="ml-4"
                    @update:model-value="toggleAutoAccept" />
            </v-row>
        </v-card>

        <template v-if="theirsPromise">
            <v-container fluid class="px-0 px-sm-4 py-0">
                <friend-compare :friend-username="friend.username" :theirs="theirsPromise" />
            </v-container>

            <dashboard :user-id="friend.id" :show-bar="false" :preloaded-stat="theirsPromise" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import Dashboard from "@/views/stats/Dashboard.vue";
import FriendCompare from "@/components/friends/FriendCompare.vue";
import { useFriend } from "@/composables/friend";
import { useStatistic } from "@/composables/statistic";
import { useSnackbar } from "@/composables/snackbar";
import { AUTO_ACCEPT_ICON, BACK_ICON } from "@/constants/icons";
import type { GlobalStat } from "@/models/stat";
import type { User } from "@/models/user";
import { goBack as navigateBack } from "@/utils/navigation";
import { formatMonthYear } from "@/utils/date";
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: String, required: true }
});

const router = useRouter();
const { getCachedFriends, getAutoAcceptWatchTogether, setAutoAcceptWatchTogether } = useFriend();
const { getStats } = useStatistic();
const { showError } = useSnackbar();

const friend = ref<User>();
const theirsPromise = ref<Promise<GlobalStat>>();
const autoAccept = ref(false);

const goBack = () => navigateBack(router, "/friends");

const load = async (): Promise<void> => {
    friend.value = (await getCachedFriends()).find((user) => user.id === props.id);

    if (!friend.value) {
        router.replace('/friends');
        return;
    }
    theirsPromise.value = getStats(friend.value.id);

    try {
        autoAccept.value = await getAutoAcceptWatchTogether(friend.value.id);
    } catch (e) {
        showError((e as Error).message);
    }
}

// Guards against an older, slower request resolving after a newer one and rolling back (or
// leaving stuck) a toggle the user has already changed again in the meantime - same pattern as
// Settings.vue's notification toggles. The error itself is always surfaced, superseded or not.
let autoAcceptRequestId = 0;

const toggleAutoAccept = async (value: boolean | null): Promise<void> => {
    if (!friend.value) return;
    const requestId = ++autoAcceptRequestId;
    const previous = autoAccept.value;
    autoAccept.value = !!value;

    try {
        await setAutoAcceptWatchTogether(friend.value, !!value);
    } catch (e) {
        if (requestId === autoAcceptRequestId) {
            autoAccept.value = previous;
        }
        showError((e as Error).message);
    }
}

watch(() => props.id, load);

onBeforeMount(load);
</script>

<style scoped>
.back-btn {
    margin: 12px 0 0 8px;
}

.friend-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px 24px;
    text-align: center;
}
</style>
