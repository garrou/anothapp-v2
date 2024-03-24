<template>
    <base-app-bar search @search="fetchSeries" />
    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";

const { getSeries } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (title?: string): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: title });
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>