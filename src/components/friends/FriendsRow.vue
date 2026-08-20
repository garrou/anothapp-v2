<template>
    <div class="px-3">
        <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
            <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                label="Nom d'utilisateur" required variant="underlined"
                @click:append-inner="$emit('search', username)" />
        </v-form>

        <card-grid v-if="friends.length" :items="friends" :loading="loading">
            <template #default="{ item: friend }">
                <poster-card :image="friend.picture">
                    <v-card-subtitle class="pt-4">{{ friend.username }}</v-card-subtitle>

                    <template #actions>
                        <v-btn v-if="consult" :icon="DETAILS_ICON" variant="text" @click="showFriend(friend)" />
                        <v-btn v-if="addable" :icon="ADD_ICON" variant="text" @click="addFriend(friend)" />
                        <v-btn v-if="accept" icon="mdi-check" variant="text" @click="acceptFriend(friend)" />
                        <v-btn v-if="remove" :icon="DELETE_ICON" variant="text" @click="showConfirm(friend)" />
                    </template>
                </poster-card>
            </template>
        </card-grid>
        <span v-else>Aucun résultat</span>
    </div>

    <base-modal v-if="friend" v-model="modal" :max-width="1600" :title="friend.username">
        <dashboard :user-id="friend.id" :show-bar="false" />
    </base-modal>

    <base-confirm v-model="confirm" text="Supprimer cet(te) ami(e) ?" title="Supprimer" persistent
        @cancel="confirm = false" @confirm="removeFriend" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import BaseModal from "@/components/BaseModal.vue";
import CardGrid from "@/components/CardGrid.vue";
import PosterCard from "@/components/PosterCard.vue";
import Dashboard from "@/views/stats/Dashboard.vue";
import { ADD_ICON, DELETE_ICON, DETAILS_ICON, SEARCH_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { ref, type PropType } from "vue";
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