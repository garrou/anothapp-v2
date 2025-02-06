<template>
    <base-app-bar />

    <v-tabs v-model="tab" class="m-top">
        <v-tab :value="1">Amis</v-tab>
        <v-tab :value="2">Ajouter</v-tab>
        <v-tab :value="3">Reçues</v-tab>
        <v-tab :value="4">Envoyées</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="pa-1">
        <v-window-item :value="1">
            <friends-row consult :friends="friends?.friend" :loading="loading" remove />
        </v-window-item>
        <v-window-item :value="2">
            <friends-row addable :friends="searched" search @search="searchUser" @refresh="fetchFriends" />
        </v-window-item>
        <v-window-item :value="3">
            <friends-row accept :friends="friends?.receive" :loading="loading" remove @refresh="fetchFriends" />
        </v-window-item>
        <v-window-item :value="4">
            <friends-row :friends="friends?.send" :loading="loading" remove @refresh="fetchFriends" />
        </v-window-item>
    </v-window>
</template>

<script lang="ts" setup>
import FriendsRow from "@/components/friends/FriendsRow.vue";
import BaseAppBar from "@/components/BaseAppBar.vue";
import { onBeforeMount, ref } from "vue";
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