<template>
    <base-app-bar auto-search label="Chercher une série" search />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { watch } from "vue";
import { useState } from "@/composables/state";
import type { SerieSearchOptions } from "@/models/search";
import { storeToRefs } from "pinia";
import { useSerieStore } from "@/stores/serie";

const { getSeries } = useSerie();
const state = useState();
const { filterKinds, filterPlatforms, filterTitle } = storeToRefs(useSerieStore());

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (options?: SerieSearchOptions): Promise<void> => {
    loading.value = true;
    series.value = await getSeries(options);
    loading.value = false;
}

onBeforeMount(() => fetchSeries().then());

watch(state.counter, () => fetchSeries().then());

watch([filterTitle, filterKinds, filterPlatforms], () => {
    fetchSeries({
        title: filterTitle.value,
        kinds: filterKinds.value,
        platforms: filterPlatforms.value
    }).then();
});
</script>