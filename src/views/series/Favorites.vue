<template>
    <v-container>
        <series-row v-if="favorites.length" lovable :loading="loading" :series="favorites" @refresh-favs="refreshFavorites" />
        <div v-else class="text-center">Aucun favori</div>
    </v-container>
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import { useFavorite } from "@/composables/favorite";
import { useSerie } from "@/composables/serie";
import type { Serie } from "@/models/serie";
import { onBeforeUnmount } from "vue";
import { ref, onBeforeMount } from "vue";

const { getFavoriteSeries } = useSerie();
const favorite = useFavorite();

const deleted = ref(0);
const favorites = ref<Serie[]>([]);
const loading = ref(false);

const getFavorites = async () => {
    loading.value = true;
    favorites.value = await getFavoriteSeries();
    loading.value = false;
}

const refreshFavorites = async () => {
    deleted.value++;
    getFavorites();
}

onBeforeMount(async () => {
    await getFavorites();
});

onBeforeUnmount(() => {
    if (deleted.value > 0) 
        favorite.increment();
})
</script>