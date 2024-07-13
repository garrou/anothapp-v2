<template>
    <series-row :loading="loading" :series="series" small watch-status @refresh="getToContinue" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const { getSeriesByStatus } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

const getToContinue = async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("continue");
    loading.value = false;
}

onBeforeMount(async () => {
    await getToContinue();
});
</script>