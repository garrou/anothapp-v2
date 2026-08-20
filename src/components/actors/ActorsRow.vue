<template>
    <card-grid v-if="characters.length" :items="characters" :loading="loading">
        <template #default="{ item: character }">
            <poster-card :image="character.picture" @click="showModal(character.id)">
                <v-card-title>{{ character.actor }}</v-card-title>
                <v-card-subtitle class="mb-3">{{ character.name }}</v-card-subtitle>
            </poster-card>
        </template>
    </card-grid>
    <p v-else>Aucun acteur</p>

    <base-modal v-if="actor" v-model="modal" :title="actor.name">
        <actor-details :actor="actor" />
        <series-row :loading="loading" :series="actor.series" total />
    </base-modal>
</template>

<script lang="ts" setup>
import ActorDetails from "@/components/actors/ActorDetails.vue";
import BaseModal from "@/components/BaseModal.vue";
import CardGrid from "@/components/CardGrid.vue";
import PosterCard from "@/components/PosterCard.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSearch } from '@/composables/search';
import type { Actor, Character } from '@/models/person';
import { ref, type PropType } from 'vue';

defineProps({
    characters: { type: Array as PropType<Character[]>, required: true },
    loading: { type: Boolean, required: true },
});

const { getActor } = useSearch();

const actor = ref<Actor>();
const modal = ref(false);

const showModal = async (id: number) => {
    actor.value = await getActor(id);
    modal.value = true;
}
</script>