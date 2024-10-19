<template>
    <series-row :loading="loading" :series="series" @refresh="(id, kind) => refreshList(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import { useState } from "@/composables/state";
import type { Serie } from "@/models/serie";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";

const { getSeriesByStatus } = useSerie();
const state = useState();

const series = ref<Serie[]>([]);
const loading = ref(false);
const changes = ref(0);

const refreshList = (id: number, kind: string) => {
    if (kind === "list") {
        series.value = series.value.filter((serie) => serie.id !== id);
        changes.value++;
    } else if (kind === "favorite") {
        changes.value++;
    }
}

onBeforeMount(async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("not-started");
    loading.value = false;
});

onBeforeUnmount(() => {
    if (changes.value)
        state.increment();
});
</script>