<template>
    <card-grid v-if="characters.length" :items="characters" :loading="loading" :sm="4" :md="3" :lg="2" :xl="2">
        <template #default="{ item: character }">
            <poster-card :image="character.picture" :to="`/actor/${character.id}`">
                <template #quick-actions>
                    <button-favorite-actor :actor-id="character.id" :actor-name="character.actor" quick />
                </template>

                <v-card-title>
                    <router-link class="actor-card-title" :text="character.actor" :to="`/actor/${character.id}`" />
                </v-card-title>
                <v-card-subtitle class="mb-3">{{ character.name }}</v-card-subtitle>
            </poster-card>
        </template>
    </card-grid>
    <empty-state v-else icon="mdi-account-group-outline" title="Aucun acteur"
        description="Le casting de cette série n'est pas disponible." />
</template>

<script lang="ts" setup>
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PosterCard from "@/components/PosterCard.vue";
import ButtonFavoriteActor from "@/components/buttons/ButtonFavoriteActor.vue";
import type { Character } from '@/models/person';
import type { PropType } from 'vue';

defineProps({
    characters: { type: Array as PropType<Character[]>, required: true },
    loading: { type: Boolean, required: true },
});
</script>

<style scoped>
/* The global `a` link color reads poorly at v-card-title's reduced opacity
   in dark theme, unlike plain text — match the surrounding text color
   instead, consistent with other card titles in the app. */
.actor-card-title {
    color: inherit;
}
</style>
