<template>
    <v-container>
        <series-row :loading="loading" :series="series" />
    </v-container>
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { ref, onBeforeMount } from "vue";

const { getSeriesByStatus } = useSerie();

const series = ref<Serie[]>([]);
const loading = ref(false);

const getFavorites = async () => {
    loading.value = true;
    series.value = await getSeriesByStatus("not-started");
    loading.value = false;
}

onBeforeMount(async () => {
    await getFavorites();
});
</script>