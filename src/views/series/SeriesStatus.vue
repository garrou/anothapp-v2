<template>
    <base-app-bar />
    <series-row :loading="loading" :series="series" :watch-status="displayWatchStatus" @refresh="(id) => refresh(id)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { useScrollStore } from "@/stores/scroll";
import { SerieStatus } from "@/types/types";
import { ref, type PropType, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import BaseAppBar from "@/components/BaseAppBar.vue";

const props = defineProps({
    status: { type: Object as PropType<SerieStatus>, required: true }
});

const route = useRoute();
const { getSeriesByStatus } = useSerie();

const displayWatchStatus = computed(() => props.status === SerieStatus.Stopped || props.status === SerieStatus.Continue);

const series = ref<Serie[]>([]);
const loading = ref(false);

const refresh = (id: number) => {
    series.value = series.value.filter((serie) => serie.id !== id);
}

const loadSeries = async () => {
    loading.value = true;
    series.value = await getSeriesByStatus(props.status);
    loading.value = false;
};

watch(() => props.status, async () => {
    await loadSeries();
});

onMounted(async () => {
    await loadSeries();
    useScrollStore().scrollToPosition(route.fullPath);
});
</script>