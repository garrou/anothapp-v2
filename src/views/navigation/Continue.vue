<template>
    <series-row :loading="loading" :series="series" watch-status @refresh="(id, kind) => refreshContinue(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { onBeforeMount } from "vue";
import { ref } from "vue";

const { getSeriesByStatus } = useSerie();

const loading = ref(false);
const series = ref<Serie[]>([]);

const refreshContinue = (id: number, kind: string) => {
    if (kind === "watch") {
        series.value = series.value.filter((serie) => serie.id !== id);
    }
}

onBeforeMount(async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("continue");
    loading.value = false;
});
</script>