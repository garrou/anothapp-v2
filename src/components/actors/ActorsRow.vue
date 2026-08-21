<template>
    <card-grid v-if="characters.length" :items="characters" :loading="loading">
        <template #default="{ item: character }">
            <poster-card :image="character.picture" :to="`/actor/${character.id}`">
                <v-card-title>
                    <router-link :text="character.actor" :to="`/actor/${character.id}`" />
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
import type { Character } from '@/models/person';
import type { PropType } from 'vue';

defineProps({
    characters: { type: Array as PropType<Character[]>, required: true },
    loading: { type: Boolean, required: true },
});
</script>
