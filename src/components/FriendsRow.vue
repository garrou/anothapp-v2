<template>
    <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
        <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
            label="Email utilisateur" required variant="underlined" @click:append-inner="$emit('search', username)" />
    </v-form>

    <v-row v-if="friends.length">
        <v-col v-for="(friend, index) in friends" cols="6" md="4" lg="3" :key="index">
            <base-skeleton :loading="loading" type="card">
                <v-card>
                    <base-image v-if="friend.picture" cover max-height="580" :src="friend.picture" />

                    <v-card-subtitle class="pt-4">{{ friend.username }}</v-card-subtitle>

                    <v-card-actions>
                        <v-btn v-if="consult" :icon="DETAILS_ICON" variant="text" @click="showFriend(friend)" />
                        <v-btn v-if="addable" :icon="ADD_ICON" variant="text" @click="addFriend(friend)" />
                        <v-btn v-if="accept" icon="mdi-check" variant="text" @click="acceptFriend(friend)" />
                        <v-btn v-if="remove" :icon="DELETE_ICON" variant="text" @click="showConfirm(friend)" />
                    </v-card-actions>
                </v-card>
            </base-skeleton>
        </v-col>
    </v-row>
    <span v-else>Aucun résultat</span>

    <base-modal v-if="friend" v-model="modal" :max-width="1600">
        <template #title>
            <span>{{ friend.username }}</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <dashboard :user-id="friend.id" :show-bar="false" />
    </base-modal>

    <base-confirm v-model="confirm" text="Supprimer cet(te) ami(e) ?" title="Supprimer" persistent
        @cancel="confirm = false" @confirm="removeFriend" />
</template>

<script lang="ts" setup>
import BaseConfirm from "./BaseConfirm.vue";
import BaseImage from "./BaseImage.vue";
import BaseModal from "./BaseModal.vue";
import BaseSkeleton from "./BaseSkeleton.vue";
import Dashboard from "@/views/stats/Dashboard.vue";
import { ADD_ICON, CLOSE_ICON, DELETE_ICON, DETAILS_ICON, SEARCH_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { ref, type PropType } from "vue";
import { useSnackbar } from "@/composables/snackbar";
import { useFriend } from "@/composables/friend";

defineProps({
    accept: { type: Boolean, default: false },
    addable: { type: Boolean, default: false },
    consult: { type: Boolean, default: false },
    friends: { type: Array as PropType<User[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    search: { type: Boolean, default: false },
    remove: { type: Boolean, default: false }
});

const emit = defineEmits<{
    search: [string]
    refresh: []
}>();

const { acceptFriendRequest, deleteFriend, sendFriendRequest } = useFriend();

const confirm = ref(false);
const friend = ref<User>();
const modal = ref(false);
const selected = ref<User>();
const username = ref<string>("");

const showFriend = (user: User) => {
    friend.value = user;
    modal.value = true;
}

const acceptFriend = async (user: User) => {
    await acceptFriendRequest(user);
    emit("refresh");
}

const addFriend = async (user: User) => {
    await sendFriendRequest(user);
    emit("refresh");
}

const removeFriend = async () => {
    if (!selected.value) throw new Error("Impossible de supprimer cet(te) ami(e).");
    await deleteFriend(selected.value);
    confirm.value = false;
    emit("refresh");
}

const showConfirm = (user: User) => {
    selected.value = user;
    confirm.value = true;
}
</script>