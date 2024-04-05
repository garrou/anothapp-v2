<template>
    <v-container>
        <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
            <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                label="Email utilisateur" required variant="underlined"
                @click:append-inner="$emit('search', username)" />
        </v-form>

        <v-row v-if="friends.length > 0">
            <v-col v-for="(friend, index) in friends" cols="6" md="4" lg="3" :key="index">
                <base-skeleton :loading="loading" type="card">
                    <v-card>
                        <base-image v-if="friend.picture" cover max-height="580" :src="friend.picture" />

                        <v-card-subtitle class="pt-4">{{ friend.username }}</v-card-subtitle>

                        <v-card-actions>
                            <v-btn variant="text" @click="showFriend(friend)">Profil</v-btn>
                        </v-card-actions>
                    </v-card>
                </base-skeleton>
            </v-col>
        </v-row>
        <span v-else>Aucun résultat</span>
    </v-container>

    <base-modal v-if="friend" v-model="modal" :max-width="1600">
        <template #title>
            <span>{{ friend.username }}</span>
            <v-btn icon="mdi-close" variant="text" @click="modal = false" />
        </template>
        <dashboard :user-id="friend.id" :show-bar="false" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseImage from "./BaseImage.vue";
import BaseModal from "./BaseModal.vue";
import BaseSkeleton from "./BaseSkeleton.vue";
import Dashboard from "@/views/stats/Dashboard.vue";
import { SEARCH_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { ref, type PropType } from "vue";

const friend = ref<User>();
const modal = ref(false);
const username = ref<string>("");

defineProps({
    friends: { type: Array as PropType<User[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    search: { type: Boolean, default: false }
});

defineEmits<{
    search: [string]
}>();

const showFriend = (user: User) => {
    friend.value = user;
    modal.value = true;
}
</script>