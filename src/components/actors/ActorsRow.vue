<template>
    <v-row v-if="characters.length">
        <v-col v-for="character in characters" cols="6" md="4" lg="3" :key="character.id">
            <base-skeleton :loading="loading" type="card">
                <v-card @click="showModal(character.id)">
                    <base-image v-if="character.picture" cover max-height="580" :src="character.picture" />
                    <v-card-title>{{ character.actor }}</v-card-title>
                    <v-card-subtitle class="mb-3">{{ character.name }}</v-card-subtitle>
                </v-card>
            </base-skeleton>
        </v-col>
    </v-row>
    <p v-else>Aucun acteur</p>

    <base-modal v-if="actor" v-model="modal">
        <template #title>
            <v-spacer />
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>

        <actor-details :actor="actor" />
        <series-row :loading="loading" :series="actor.series" total />
    </base-modal>
</template>

<script lang="ts" setup>
import ActorDetails from "@/components/actors/ActorDetails.vue";
import BaseImage from "../BaseImage.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseSkeleton from "@/components/BaseSkeleton.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSearch } from '@/composables/search';
import { CLOSE_ICON } from '@/constants/icons';
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