<template>
    <v-form @submit="getSeries" @submit.prevent>
        <v-container>
            <v-row justify="center">
                <v-col>
                    <v-text-field v-model="search" label="Titre de la série" variant="underlined" />
                </v-col>
                <v-col>
                    <v-btn icon="mdi-magnify" type="submit" />
                </v-col>
            </v-row>
            <v-row>
                <v-col v-for="serie in series" cols="6" md="4" lg="3" :key="serie.id">
                    <v-skeleton-loader :loading="loading" type="card">
                        <v-responsive>
                            <serie-card :serie="serie" />
                        </v-responsive>
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts" setup>
import SerieCard from "@/components/SerieCard.vue";
import type { Serie } from "@/models/internal/serie";
import serieService from "@/services/serieService";
import { onBeforeMount, ref, watch } from "vue";

const loading = ref(true);
const search = ref("");
const series = ref<Serie[]>([]);

const getSeries = async (): Promise<void> => {
    series.value = await serieService.getSeries(search.value);
    loading.value = false;
}

onBeforeMount(async () => {
    await getSeries();
});

watch(search, () => {
    loading.value = true;
});
</script>