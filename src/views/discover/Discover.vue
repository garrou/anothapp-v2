<template>
    <base-app-bar discover label="Ajouter une série" search @filter="(type, value) => filterSeries(type, value)"
        @search="(title) => fetchSeries({ title })" />

    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref, watch } from "vue";
import { useSearch } from "@/composables/search";
import type { SerieSearchOptions } from "@/models/search";
import { useState } from "@/composables/state";
import type { FilterType } from "@/types/types";

const { getSeries } = useSearch();
const state = useState();

const loading = ref(false);
const series = ref<Serie[]>([]);

const filterSeries = async (type: FilterType, value: string[]): Promise<void> => {
    switch (type) {
        case "kinds":
            await fetchSeries({ kinds: value });
            break;
        case "platforms":
            await fetchSeries({ platforms: value });
            break;
    }
}  

const fetchSeries = async (options?: SerieSearchOptions): Promise<void> => {
    loading.value = true;
    series.value = await getSeries(options);
    loading.value = false;
}

watch(state.counter, async () => {
    await fetchSeries();
});

onBeforeMount(async () => {
    await fetchSeries();
});
</script>