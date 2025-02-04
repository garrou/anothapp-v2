<template>
    <base-app-bar discover placeholder="Ajouter une série" search />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref, watch } from "vue";
import { useSearch } from "@/composables/search";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";

const { getSeries } = useSearch();
const { filterKinds, filterLimit, filterPlatforms, filterTitle } = storeToRefs(useSearchStore());

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries();
    loading.value = false;
}

watch([filterTitle, filterKinds, filterPlatforms, filterLimit], () => {
    fetchSeries().then();
});

onBeforeMount(() => fetchSeries().then());
</script>