<template>
    <series-row :loading="loading" :series="favorites" @refresh="(id, kind) => refreshFavorites(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import { useState } from "@/composables/state";
import type { Serie } from "@/models/serie";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";

const { getSeriesByStatus } = useSerie();
const state = useState();
const favorites = ref<Serie[]>([]);
const loading = ref(false);
const changes = ref(0);

const refreshFavorites = (id: number, kind: string) => {
    if (kind === "favorite") {
        favorites.value = favorites.value.filter((serie) => serie.id !== id);
        changes.value++;
    }
}

onBeforeMount(async () => {
    loading.value = true;
    favorites.value = await getSeriesByStatus("favorite");
    loading.value = false;
});

onBeforeUnmount(() => {
    if (changes.value)
        state.increment();
});
</script>