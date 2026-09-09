<template>
    <div v-if="friend">
        <v-btn class="back-btn" icon="mdi-chevron-left" variant="text" @click="goBack" />

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

            <v-container v-if="playlists.length" fluid class="px-0 px-sm-4">
                <h3 class="playlists-title">Playlists de {{ friend.username }}</h3>
                <card-grid :items="playlists" :loading="false" :sm="6" :md="4" :lg="3">
                    <template #default="{ item: playlist }">
                        <v-card class="playlist-card" :to="`/playlists/${playlist.id}`">
                            <v-card-title>{{ playlist.name }}</v-card-title>
                            <v-card-subtitle class="pb-4">
                                {{ buildPlural("série", playlist.showsCount ?? 0) }}
                            </v-card-subtitle>
                        </v-card>
                    </template>
                </card-grid>
            </v-container>

            <dashboard :user-id="friend.id" :show-bar="false" :preloaded-stat="theirsPromise" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import Dashboard from "@/views/stats/Dashboard.vue";
import FriendCompare from "@/components/friends/FriendCompare.vue";
import CardGrid from "@/components/CardGrid.vue";
import { useFriendStore } from "@/stores/friend";
import { useStatistic } from "@/composables/statistic";
import { usePlaylist } from "@/composables/playlist";
import type { GlobalStat } from "@/models/stat";
import type { Playlist } from "@/models/playlist";
import { buildPlural } from "@/utils/format";
import { goBack as navigateBack } from "@/utils/navigation";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const friendStore = useFriendStore();
const { getStats } = useStatistic();
const { getPlaylists } = usePlaylist();
const { friend } = storeToRefs(friendStore);

const theirsPromise = ref<Promise<GlobalStat>>();
const playlists = ref<Playlist[]>([]);

const goBack = () => {
    friendStore.reset();
    navigateBack(router, "/friends");
}

onBeforeMount(() => {
    if (!friend.value) {
        router.replace('/friends');
        return;
    }
    theirsPromise.value = getStats(friend.value.id);
    getPlaylists(friend.value.id).then((data) => playlists.value = data).catch(() => {});
});
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

.playlists-title {
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
}

.playlist-card {
    height: 100%;
}
</style>
