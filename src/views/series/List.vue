<template>
    <v-container>
        <series-row :loading="loading" :series="favorites" />
    </v-container>
</template>

<script lang="ts" setup>
import SeriesRow from '@/components/SeriesRow.vue';
import { useSerie } from '@/composables/serie';
import type { Serie } from '@/models/serie';
import { ref, onBeforeMount } from 'vue';

const { getSeriesNotStarted } = useSerie();

const favorites = ref<Serie[]>([]);
const loading = ref(false);

const getFavorites = async () => {
    loading.value = true;
    favorites.value = await getSeriesNotStarted();
    loading.value = false;
}

onBeforeMount(async () => {
    await getFavorites();
});
</script>