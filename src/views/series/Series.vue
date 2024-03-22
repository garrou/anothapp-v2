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

    <v-container class="mt-10">
        <v-form @submit="loadSeries" @submit.prevent>
            <v-row align="center">
                <v-col cols="9">
                    <v-text-field v-model="search" label="Titre de la série" variant="underlined" />
                </v-col>
                <v-col cols="3">
                    <v-btn type="submit" size="small">
                        <template #default>
                            <v-icon :icon="SEARCH_ICON" />
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                    <v-skeleton-loader :elevation="ELEVATION" :loading="loading" type="card">
                        <v-responsive>
                            <serie-card :serie="serie" />
                        </v-responsive>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSerie } from "@/composables/serie";
import { SERIES_MENU } from "@/constants/menus";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SEARCH_ICON } from "@/constants/icons";

const { getSeries } = useSerie();

const loading = ref(false);
const search = ref();
const series = ref<Serie[]>([]);
const drawer = ref(false);

const loadSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: search.value });
    loading.value = false;
}

onBeforeMount(async () => {
    await loadSeries();
});
</script>