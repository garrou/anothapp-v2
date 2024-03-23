<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <v-app-bar-title>A</v-app-bar-title>
        </v-app-bar>
    </v-layout>

    <series-row :loading="loading" :series="series" @search="fetchSeries" @show="show" />

    <base-modal v-if="selected" v-model="modal">
        <v-card align="center" class="pa-2">
            <v-card-title class="d-flex flex-row-reverse">
                <v-btn icon="mdi-close" variant="text" @click="modal = false" />
            </v-card-title>
            <serie-details :serie="selected" />
        </v-card>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseModal from "@/components/BaseModal.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import SerieDetails from "@/components/SerieDetails.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { DENSITY, ELEVATION } from "@/constants/style";

const { getSeries } = useSearch();

const modal = ref(false);
const loading = ref(false);
const series = ref<Serie[]>([]);
const selected = ref<Serie>();

const fetchSeries = async (title?: string): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: title });
    loading.value = false;
}

const show = (serie: Serie) => {
    modal.value = true;
    selected.value = serie;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>