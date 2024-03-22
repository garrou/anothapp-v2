<template>
    <v-layout>
        <v-app-bar :density="DENSITY" :elevation="ELEVATION" >
            <v-app-bar-title>A</v-app-bar-title>
        </v-app-bar>
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
                            <serie-card :serie="serie" @show="show" />
                        </v-responsive>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-form>
    </v-container>

    <v-dialog v-if="selected" v-model="dialog">
        <serie-details :serie="selected" />
    </v-dialog>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import SerieDetails from "@/components/SerieDetails.vue";
import type { Serie } from "@/models/serie";
import { onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { DENSITY, ELEVATION } from "@/constants/style";
import { SEARCH_ICON } from "@/constants/icons";

const { getSeries } = useSearch();

const dialog = ref(false);
const loading = ref(false);
const search = ref("");
const series = ref<Serie[]>([]);
const selected = ref<Serie>();

const loadSeries = async (): Promise<void> => {
    loading.value = true;
    series.value = await getSeries({ title: search.value });
    loading.value = false;
}

const show = (serie: Serie) => {
    dialog.value = true;
    selected.value = serie;
}

onBeforeMount(async () => {
    await loadSeries();
});
</script>@/constants/menus@/models/serie