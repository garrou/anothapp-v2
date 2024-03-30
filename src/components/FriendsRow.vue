<template>
    <v-container>
        <v-form v-if="search" @submit="$emit('search', username)" @submit.prevent>
            <v-text-field v-model="username" :append-inner-icon="SEARCH_ICON" class="mb-4" clearable
                label="Email utilisateur" required variant="underlined" @click:append-inner="$emit('search', username)" />
        </v-form>

        <v-row>
            <v-col v-for="(friend, index) in friends" cols="6" md="4" lg="3" :key="index">
                <v-skeleton-loader :elevation="ELEVATION" :loading="loading" type="card">
                    <v-responsive>
                        <v-card>
                            <base-image v-if="friend.picture" cover max-height="580" :src="friend.picture" />

                            <v-card-subtitle class="pt-4">{{ friend.username }}</v-card-subtitle>

                            <v-card-actions>
                                <v-btn variant="text" @click="">Profil</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-responsive>
                </v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { SEARCH_ICON } from "@/constants/icons";
import BaseImage from "./BaseImage.vue";
import { ELEVATION } from "@/constants/style";
import type { User } from "@/models/user";
import { ref, type PropType } from "vue";

const username = ref("");

defineProps({
    friends: { type: Array as PropType<User[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    search: { type: Boolean, default: false }
});
</script>