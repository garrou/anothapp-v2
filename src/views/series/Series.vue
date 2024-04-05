<template>
    <base-app-bar search @search="fetchSeries" />
    <series-row lovable :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { watch } from "vue";
import { useFavorite } from "@/composables/favorite";

const { getSeries } = useSerie();
const favorite = useFavorite();

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

watch(favorite.deleted, async () => {
    await fetchSeries();
});
</script>