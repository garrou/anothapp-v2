<template>
    <div v-if="friend">
        <v-btn class="back-btn" :icon="BACK_ICON" variant="text" @click="goBack" />

        <div class="friend-hero">
            <v-avatar size="96" :color="friend.picture ? undefined : 'primary'">
                <v-img v-if="friend.picture" :src="friend.picture" alt="" />
                <span v-else class="text-h4 font-weight-bold">{{ friend.username.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div class="text-h6 font-weight-bold mt-3">{{ friend.username }}</div>
        </div>

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
import { BACK_ICON } from "@/constants/icons";
import type { GlobalStat } from "@/models/stat";
import type { User } from "@/models/user";
import { goBack as navigateBack } from "@/utils/navigation";
import { onBeforeMount, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: String, required: true }
});

const router = useRouter();
const { getCachedFriends } = useFriend();
const { getStats } = useStatistic();

const friend = ref<User>();
const theirsPromise = ref<Promise<GlobalStat>>();

const goBack = () => navigateBack(router, "/friends");

const load = async (): Promise<void> => {
    friend.value = (await getCachedFriends()).find((user) => user.id === props.id);

    if (!friend.value) {
        router.replace('/friends');
        return;
    }
    theirsPromise.value = getStats(friend.value.id);
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
