<template>
    <base-app-bar />

    <v-container>
        <v-tabs v-model="tab" align-tabs="title">
            <v-tab :value="1">Amis</v-tab>
            <v-tab :value="2">Chercher</v-tab>
            <v-tab :value="3">Reçues</v-tab>
            <v-tab :value="4">Envoyées</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="pa-1">
            <v-window-item :value="1">
                <friends-row :friends="friends?.friend" :loading="loading" />
            </v-window-item>
            <v-window-item :value="2">
                <friends-row search />
            </v-window-item>
            <v-window-item :value="3">
                <friends-row :friends="friends?.receive" :loading="loading" />
            </v-window-item>
            <v-window-item :value="4">
                <friends-row :friends="friends?.send" :loading="loading" />
            </v-window-item>
        </v-window>
    </v-container>
</template>

<script lang="ts" setup>
import FriendsRow from '@/components/FriendsRow.vue';
import BaseAppBar from '@/components/BaseAppBar.vue';
import { onBeforeMount, ref } from 'vue';
import { useFriend } from '@/composables/friend';
import type { FriendResponse } from '@/models/friend';

const { getFriends } = useFriend();

const friends = ref<FriendResponse>();
const loading = ref(false);
const tab = ref(0);

onBeforeMount(async () => {
    loading.value = true;
    friends.value = await getFriends();
    loading.value = false;
});
</script>