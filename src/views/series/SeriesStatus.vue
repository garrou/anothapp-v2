<template>
    <base-app-bar />

    <div class="status-heading">
        <v-icon :icon="statusMeta.icon" color="primary" size="22" />
        <h1 class="status-heading-title">{{ statusMeta.title }}</h1>
    </div>

    <series-row :loading="loading" :series="series" :watch-status="displayWatchStatus" :empty-title="emptyCopy.title"
        :empty-description="emptyCopy.description" @refresh="(id) => refresh(id)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/series/SeriesRow.vue";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { useScrollStore } from "@/stores/scroll";
import { NAV_SERIES_STATUS } from "@/constants/menus";
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

const statusMeta = computed(() =>
    NAV_SERIES_STATUS.find((item) => item.status === props.status) ?? NAV_SERIES_STATUS[0]);

const emptyCopy = computed(() => {
    switch (props.status) {
        case SerieStatus.Favorite:
            return { title: "Aucun favori", description: "Ajoutez une série à vos favoris depuis sa fiche." };
        case SerieStatus.Continue:
            return { title: "Rien à continuer", description: "Les séries dont le visionnage est en cours apparaîtront ici." };
        case SerieStatus.Stopped:
            return { title: "Aucune série arrêtée", description: "Les séries que vous arrêtez de suivre apparaissent ici." };
        default:
            return { title: "Votre liste est vide", description: "Ajoutez une série depuis Découvrir pour commencer à la suivre." };
    }
});

const series = ref<Serie[]>([]);
const loading = ref(false);

const refresh = (id: number) => {
    series.value = series.value.filter((serie) => serie.id !== id);
}

const loadSeries = async () => {
    loading.value = true;
    try {
        series.value = await getSeriesByStatus(props.status);
    } finally {
        loading.value = false;
    }
};

watch(() => props.status, async () => {
    await loadSeries();
});

onMounted(async () => {
    await loadSeries();
    useScrollStore().scrollToPosition(route.fullPath);
});
</script>

<style scoped>
.status-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px 4px;
}

.status-heading-title {
    font-size: 20px;
}
</style>