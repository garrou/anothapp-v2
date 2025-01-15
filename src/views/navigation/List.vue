<template>
    <series-row :loading="loading" :series="series" @refresh="(id, kind) => refreshList(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { ref, onBeforeMount } from "vue";

const { getSeriesByStatus } = useSerie();

const series = ref<Serie[]>([]);
const loading = ref(false);

const refreshList = (id: number, kind: string) => {
    if (kind === "list") {
        series.value = series.value.filter((serie) => serie.id !== id);
    }
}

onBeforeMount(async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("not-started");
    loading.value = false;
});
</script>