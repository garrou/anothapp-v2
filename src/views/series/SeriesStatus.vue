<template>
    <base-app-bar />

    <series-tabs class="mx-3 mt-4 mb-2" />

    <watch-together-invites-row v-if="isWatchTogether" active class="mt-2" :invites="invites" :loading="loading"
        @refresh="loadSeries" />
    <series-row v-else :loading="loading" :series="series" :watch-status="displayWatchStatus" :empty-title="emptyCopy.title"
        :empty-description="emptyCopy.description" @refresh="(id, kind) => refresh(id, kind)" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/series/SeriesRow.vue";
import SeriesTabs from "@/components/series/SeriesTabs.vue";
import WatchTogetherInvitesRow from "@/components/friends/WatchTogetherInvitesRow.vue";
import { useSerie } from "@/composables/serie";
import { useSeason } from "@/composables/season";
import type { Serie } from "@/models/serie";
import type { WatchTogetherInvite } from "@/models/season";
import { useScrollStore } from "@/stores/scroll";
import { SerieStatus } from "@/types/types";
import { ref, type PropType, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import BaseAppBar from "@/components/BaseAppBar.vue";

const props = defineProps({
    status: { type: String as PropType<SerieStatus>, required: true }
});

const route = useRoute();
const { getSeriesByStatus } = useSerie();
const { getWatchedWith } = useSeason();

const isWatchTogether = computed(() => props.status === SerieStatus.WatchTogether);

const displayWatchStatus = computed(() => props.status === SerieStatus.Stopped || props.status === SerieStatus.Continue);

const emptyCopy = computed(() => {
    switch (props.status) {
        case SerieStatus.Favorite:
            return { title: "Aucun favori", description: "Ajoutez une série à vos favoris depuis sa fiche." };
        case SerieStatus.Continue:
            return { title: "Rien à continuer", description: "Les séries dont le visionnage est en cours apparaîtront ici." };
        case SerieStatus.Stopped:
            return { title: "Aucune série arrêtée", description: "Les séries que vous arrêtez de suivre apparaissent ici." };
        case SerieStatus.Finished:
            return { title: "Aucune série terminée", description: "Les séries terminées que vous avez entièrement vues apparaissent ici." };
        default:
            return { title: "Votre liste est vide", description: "Ajoutez une série depuis Découvrir pour commencer à la suivre." };
    }
});

const series = ref<Serie[]>([]);
const invites = ref<WatchTogetherInvite[]>([]);
const loading = ref(false);

const refresh = (id: number, kind: "favorite" | "list" | "watch") => {
    const affectsCurrentStatus =
        (props.status === SerieStatus.Favorite && kind === "favorite") ||
        (props.status === SerieStatus.Watchlist && kind === "list") ||
        ((props.status === SerieStatus.Continue || props.status === SerieStatus.Stopped) && kind === "watch");

    if (affectsCurrentStatus) {
        series.value = series.value.filter((serie) => serie.id !== id);
    }
}

const loadSeries = async () => {
    loading.value = true;
    try {
        if (isWatchTogether.value) {
            invites.value = await getWatchedWith("active");
        } else {
            series.value = await getSeriesByStatus(props.status);
        }
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