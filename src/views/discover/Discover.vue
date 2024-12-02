<template>
    <base-app-bar discover label="Ajouter une série" search />
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
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";

const { getSeries } = useSearch();
const { filterKinds, filterLimit, filterPlatforms, filterYear, filterTitle } = storeToRefs(useSearchStore());
const state = useState();

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (options?: SerieSearchOptions): Promise<void> => {
    loading.value = true;
    series.value = await getSeries(options);
    loading.value = false;
}

watch(state.counter, () => fetchSeries().then());

watch([filterTitle, filterKinds, filterPlatforms, filterLimit, filterYear], () => {
    fetchSeries({ 
        title: filterTitle.value,
        kinds: filterKinds.value, 
        platforms: filterPlatforms.value, 
        limit: filterLimit.value,
        year: filterYear.value
    }).then();
});

onBeforeMount(() => fetchSeries().then());
</script>