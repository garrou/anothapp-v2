<template>
    <base-app-bar class="pb-4" />

    <pill-tabs v-model="tab" class="m-top mb-4 px-3" :tabs="friendsTabs" />

    <v-window v-model="tab" class="pa-1">
        <v-window-item :value="1">
            <leaderboard-list v-if="friends?.friends?.length" class="px-3 mb-4" />
            <friends-row consult :friends="friends?.friends" :loading="loading" remove @refresh="fetchFriends" />
        </v-window-item>

        <v-window-item :value="2">
            <pill-tabs v-model="manageTab" class="mb-4 px-3" :tabs="manageTabs" />

            <v-window v-model="manageTab">
                <v-window-item :value="1">
                    <friends-row addable :friends="searched" search :existing-ids="existingIds" @search="searchUser"
                        @refresh="fetchFriends" />
                </v-window-item>
                <v-window-item :value="2">
                    <friends-row accept :friends="friends?.received" :loading="loading" remove @refresh="fetchFriends" />
                </v-window-item>
                <v-window-item :value="3">
                    <friends-row :friends="friends?.sent" :loading="loading" remove @refresh="fetchFriends" />
                </v-window-item>
            </v-window>
        </v-window-item>
    </v-window>
</template>

<script lang="ts" setup>
import FriendsRow from "@/components/friends/FriendsRow.vue";
import LeaderboardList from "@/components/friends/LeaderboardList.vue";
import BaseAppBar from "@/components/BaseAppBar.vue";
import PillTabs from "@/components/PillTabs.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useFriend } from "@/composables/friend";
import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";
import { useUser } from "@/composables/user";

const { getFriends } = useFriend();
const { getUsers } = useUser();

const friends = ref<FriendResponse>();
const searched = ref<User[]>([]);
const loading = ref(false);
const tab = ref(1);
const manageTab = ref(1);

const friendsTabs = computed(() => [
    { value: 1, label: "Amis" },
    { value: 2, label: "Gérer", badge: friends.value?.received?.length }
]);

const manageTabs = computed(() => [
    { value: 1, label: "Ajouter" },
    { value: 2, label: "Reçues", badge: friends.value?.received?.length },
    { value: 3, label: "Envoyées" }
]);

// Anyone already in a relation (friend, pending sent, or pending received) with the
// current user - the backend rejects a new request to any of them with a 409.
const existingIds = computed<string[]>(() => [
    ...(friends.value?.friends?.map((f) => f.id) ?? []),
    ...(friends.value?.sent?.map((f) => f.id) ?? []),
    ...(friends.value?.received?.map((f) => f.id) ?? []),
]);

const searchUser = async (username: string) => {
    loading.value = true;
    try {
        searched.value = await getUsers(username);
    } finally {
        loading.value = false;
    }
}

const fetchFriends = async () => {
    loading.value = true;
    try {
        friends.value = await getFriends();
    } finally {
        loading.value = false;
    }
}

onBeforeMount(async () => {
    await fetchFriends();

    // Land straight on "Reçues" instead of the default "Ajouter" sub-tab when there's
    // something pending - "Reçues" used to be one flat tab click away, now it's nested
    // under "Gérer", so this keeps it just as fast to reach from the nav badge.
    if (friends.value?.received?.length) {
        manageTab.value = 2;
    }
});
</script>


<style scoped>
.m-top {
    margin-top: 20px;
}
</style>
