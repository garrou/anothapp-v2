<template>
    <v-container v-if="infos && seasons">
        <v-toolbar color="white" density="compact">
            <v-app-bar-nav-icon @click="$router.replace('/series')">
                <v-icon>mdi-chevron-left</v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title>{{ infos.serie.title }}</v-toolbar-title>

            <v-btn icon @click="changeFavorite">
                <v-icon :color="favoriteColor">mdi-heart</v-icon>
            </v-btn>

            <v-btn icon @click="dialog = true">
                <v-icon>mdi-delete</v-icon>
            </v-btn>

            <template v-slot:extension>
                <v-tabs v-model="tab" align-tabs="title">
                    <v-tab :value="1">Informations</v-tab>
                    <v-tab :value="2">Saisons</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>

        <v-window v-model="tab" class="pa-1">
            <v-window-item title="Informations" :value="1">
                <v-card class="mb-1">
                    <v-card-title>Temps de visionnage</v-card-title>
                    <v-card-text>{{ time }}</v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>Saisons vues ({{ infos.seasons.length }} / {{ seasons.length }})</v-card-title>
                    <v-card-text>
                        <v-progress-linear v-model="infos.seasons.length" height="10" :max="seasons.length" rounded
                            striped />
                    </v-card-text>
                </v-card>
            </v-window-item>

            <v-window-item title="Mes saisons" :value="2">
                <v-row>
                    <v-col v-for="season in infos.seasons" cols="6" md="4" lg="3" :key="season.number">
                        <v-skeleton-loader :loading="loading" type="card" elevation="3">
                            <v-responsive>
                                <season-card :season="season">
                                    <template #delete>
                                        <v-btn color="surface-variant" icon="mdi-delete" size="small" variant="text"
                                            @click="" />
                                    </template>
                                </season-card>
                            </v-responsive>
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>
    </v-container>

    <base-dialog v-model="dialog" title="Supprimer" text="Confirmez-vous la suppression de la série ?"
        @cancel="dialog = false" @confirm="removeSerie" />
</template>

<script lang="ts" setup>
import BaseDialog from "@/components/BaseDialog.vue";
import SeasonCard from "@/components/SeasonCard.vue";
import type { SerieInfos } from "@/models/internal/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import { minsToStringHoursDays } from "@/utils/format";
import type { Season } from "@/models/internal/season";
import router from "@/router";

const props = defineProps({
    id: { type: Number, required: true }
});

const { deleteSerie, getSerie, updateFavorite } = useSerie();
const { getSeasonsBySerieId } = useSearch();

const dialog = ref(false);
const infos = ref<SerieInfos>();
const isFavorite = ref(infos.value?.serie.favorite);
const loading = ref(false);
const seasons = ref<Season[]>();
const tab = ref(1);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerie({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    loading.value = false;
}

const changeFavorite = async () => {
    if (!infos.value?.serie) return
    isFavorite.value = await updateFavorite(infos.value?.serie);
}

const removeSerie = async () => {
    if (!infos.value?.serie) return
    dialog.value = !await deleteSerie(infos.value?.serie);
    router.replace("/series");
}

onBeforeMount(async () => {
    await load();
});
</script>