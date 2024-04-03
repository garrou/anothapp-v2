<template>
    <v-container>
        <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
            <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                label="Email utilisateur" required variant="underlined" @click:append-inner="$emit('search', username)" />
        </v-form>

        <v-row v-if="friends.length > 0">
            <v-col v-for="(friend, index) in friends" cols="6" md="4" lg="3" :key="index">
                <base-skeleton :loading="loading" type="card">
                    <template #content>
                        <v-card>
                            <base-image v-if="friend.picture" cover max-height="580" :src="friend.picture" />

                            <v-card-subtitle class="pt-4">{{ friend.username }}</v-card-subtitle>

                            <v-card-actions>
                                <v-btn variant="text" @click="">Profil</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </base-skeleton>
            </v-col>
        </v-row>
        <span v-else>Aucun résultat</span>
    </v-container>
</template>

<script lang="ts" setup>
import { SEARCH_ICON } from "@/constants/icons";
import BaseImage from "./BaseImage.vue";
import BaseSkeleton from "./BaseSkeleton.vue";
import type { User } from "@/models/user";
import { ref, type PropType } from "vue";

const username = ref<string>();

defineProps({
    friends: { type: Array as PropType<User[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    search: { type: Boolean, default: false }
});

defineEmits<{
    search: [string|undefined]
}>();
</script>