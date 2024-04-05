<template>
    <base-app-bar search @search="fetchSeries" />

    <series-row :loading="loading" :series="series" @show-serie="showSerie" />

    <base-modal v-if="selected" v-model="modal">
        <template #title>
            <v-spacer />
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <serie-detail :serie="selected" />
    </base-modal>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseModal from "@/components/BaseModal.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import SerieDetail from "@/components/SerieDetail.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { CLOSE_ICON } from "@/constants/icons";

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

const showSerie = (serie: Serie) => {
    modal.value = true;
    selected.value = serie;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>