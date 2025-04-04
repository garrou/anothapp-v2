<template>
    <series-row :loading="loading" :series="favorites" @refresh="(id, kind) => refreshFavorites(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { SerieStatus } from "@/types/types";
import { ref, onBeforeMount } from "vue";

const { getSeriesByStatus } = useSerie();
const favorites = ref<Serie[]>([]);
const loading = ref(false);

const refreshFavorites = (id: number, kind: string) => {
    if (kind === "favorite") {
        favorites.value = favorites.value.filter((serie) => serie.id !== id);
    }
}

onBeforeMount(async () => {
    loading.value = true;
    favorites.value = await getSeriesByStatus(SerieStatus.Favorite);
    loading.value = false;
});
</script>