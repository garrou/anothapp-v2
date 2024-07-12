<template>
    <series-row :loading="loading" :series="series" watch-status @refresh="getToResume" />
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

const getToResume = async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("resume");
    loading.value = false;
}

onBeforeMount(async () => {
    await getToResume();
});
</script>