<template>
    <base-app-bar discover placeholder="Ajouter une série" search />
    <friend-recommendations v-if="!searchStore.hasChanges()" />
    <div class="px-4 pt-4">
        <span class="v-card-title pa-0">Découvrir</span>
    </div>
    <series-row :loading="loading" :series="series" hide-details-button empty-title="Aucun résultat"
        empty-description="Essayez un autre titre, ou modifiez vos filtres." :empty-cta="false" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import SeriesRow from "@/components/series/SeriesRow.vue";
import FriendRecommendations from "@/components/friends/FriendRecommendations.vue";
import type { Serie } from "@/models/serie";
import { onMounted, ref, watch } from "vue";
import { useSearch } from "@/composables/search";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useRoute } from "vue-router";
import { useScrollStore } from "@/stores/scroll";

const route = useRoute();
const scrollStore = useScrollStore();
const { getSeries } = useSearch();
const searchStore = useSearchStore();
const { filterKinds, filterLimit, filterPlatforms, filterTitle } = storeToRefs(searchStore);

const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    try {
        series.value = await getSeries();
    } finally {
        loading.value = false;
    }
}

watch([filterTitle, filterKinds, filterPlatforms, filterLimit], () => {
    fetchSeries().then();
});

onMounted(async () => {
    await fetchSeries();
    scrollStore.scrollToPosition(route.fullPath);
});
</script>