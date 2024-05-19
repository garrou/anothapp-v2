<template>
    <base-app-bar discover search @filter="filterSeries" @search="fetchSeries" />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";

const { getSeries } = useSearch();

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (title?: string): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: title });
    loading.value = false;
}

const filterSeries = async (kind: string): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ kind: kind });
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>