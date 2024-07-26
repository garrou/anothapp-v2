<template>
    <base-app-bar discover label="Ajouter une série" search @filter="(_, kind) => fetchSeries({ kind })"
        @search="(title) => fetchSeries({ title })" />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import type { SerieSearchOptions } from "@/models/search";

const { getSeries } = useSearch();

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (options?: SerieSearchOptions): Promise<void> => {
    loading.value = true;
    series.value = await getSeries(options);
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>