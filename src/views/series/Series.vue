<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION">
            <template #prepend>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>A</v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="left" temporary>
            <v-list-item v-for="(item, index) in SERIES_MENU" :key="index" :prepend-icon="item.icon" :title="item.title"
                @click="" />
        </v-navigation-drawer>
    </v-layout>

    <series-row :loading="loading" :series="series" @search="fetchSeries" />
</template>

<script lang="ts" setup>
import SeriesRow from "@/components/SeriesRow.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { SERIES_MENU } from "@/constants/menus";
import { DENSITY, ELEVATION } from "@/constants/style";

const { getSeries } = useSerie();

const drawer = ref(false);
const loading = ref(false);
const series = ref<Serie[]>([]);

const fetchSeries = async (title?: string): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: title });
    loading.value = false;
}

onBeforeMount(async () => {
    await fetchSeries();
});
</script>