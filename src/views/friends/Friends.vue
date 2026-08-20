<template>
    <base-app-bar class="pb-4" />

    <pill-tabs v-model="tab" class="m-top mb-4 px-3" :tabs="FRIENDS_TABS" />

    <v-window v-model="tab" class="pa-1">
        <v-window-item :value="1">
            <friends-row consult :friends="friends?.friends" :loading="loading" remove />
        </v-window-item>
        <v-window-item :value="2">
            <friends-row addable :friends="searched" search @search="searchUser" @refresh="fetchFriends" />
        </v-window-item>
        <v-window-item :value="3">
            <friends-row accept :friends="friends?.received" :loading="loading" remove @refresh="fetchFriends" />
        </v-window-item>
        <v-window-item :value="4">
            <friends-row :friends="friends?.sent" :loading="loading" remove @refresh="fetchFriends" />
        </v-window-item>
    </v-window>
</template>

<script lang="ts" setup>
import FriendsRow from "@/components/friends/FriendsRow.vue";
import BaseAppBar from "@/components/BaseAppBar.vue";
import PillTabs from "@/components/PillTabs.vue";
import { onBeforeMount, ref } from "vue";
import { useFriend } from "@/composables/friend";
import type { FriendResponse } from "@/models/friend";
import type { User } from "@/models/user";
import { useUser } from "@/composables/user";

const FRIENDS_TABS = [
    { value: 1, label: "Amis" },
    { value: 2, label: "Ajouter" },
    { value: 3, label: "Reçues" },
    { value: 4, label: "Envoyées" }
];

const { getFriends } = useFriend();
const { getUsers } = useUser();

const friends = ref<FriendResponse>();
const searched = ref<User[]>([]);
const loading = ref(false);
const tab = ref(1);

const searchUser = async (username: string) => {
    loading.value = true;
    searched.value = await getUsers(username);
    loading.value = false;
}

const fetchFriends = async () => {
    loading.value = true;
    friends.value = await getFriends();
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchFriends();
});
</script>


<style scoped>
.m-top {
    margin-top: 50px;
}
</style>