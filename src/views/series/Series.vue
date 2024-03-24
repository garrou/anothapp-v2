<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <template #title>
                <v-text-field v-model="search" :append-inner-icon="SEARCH_ICON" class="mb-4" hide-details
                    label="Title de la série" single-line variant="plain" @click:append-inner="fetchSeries" />
            </template>

            <template #append>
                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="left" temporary>
            <v-list-item v-for="(item, index) in SERIES_MENU" :key="index" :prepend-icon="item.icon" :title="item.title"
                @click="" />
        </v-navigation-drawer>
    </v-layout>

    <series-row :loading="loading" :series="series" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { SERIES_MENU } from "@/constants/menus";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SEARCH_ICON } from "@/constants/icons";

const { getSeries } = useSerie();

const drawer = ref(false);
const loading = ref(false);
const search = ref<string>();
const series = ref<Serie[]>([]);

const fetchSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: search.value });
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>