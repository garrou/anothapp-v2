<template>
    <v-container>
        <series-row v-if="series.length > 0" :loading="loading" :series="series" />
        <span v-else>Aucun série à commencer</span>
    </v-container>
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { ref, onBeforeMount } from "vue";

const { getSeriesNotStarted } = useSerie();

const series = ref<Serie[]>([]);
const loading = ref(false);

const getFavorites = async () => {
    loading.value = true;
    series.value = await getSeriesNotStarted();
    loading.value = false;
}

onBeforeMount(async () => {
    await getFavorites();
});
</script>