<template>
    <v-container v-if="infos && seasons">
        <base-toolbar :title="infos.serie.title" @back="$router.push('/series')">
            <template #firstBtn>
                <v-btn icon @click="changeFavorite">
                    <v-icon :color="favoriteColor">mdi-heart</v-icon>
                </v-btn>
            </template>

            <template #secondBtn>
                <v-btn icon @click="dialog = true">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <template #tabs>
                <v-tabs v-model="tab" align-tabs="title">
                    <v-tab :value="1">Mes saisons</v-tab>
                    <v-tab :value="2">Ajouter</v-tab>
                </v-tabs>
            </template>
        </base-toolbar>

        <v-window v-model="tab">
            <v-window-item :value="1" class="pa-2">
                <v-card class="mb-2">
                    <v-row>
                        <v-col cols="3">
                            <base-image :src="infos.serie.poster" max-height="350" class="ma-2" />
                        </v-col>
                        <v-col cols="9">
                            <v-card-title>Temps de visionnage</v-card-title>
                            <v-card-text>{{ time }}</v-card-text>

                            <v-card-title>Avancement {{ infos.seasons.length }} / {{ seasons.length }}</v-card-title>
                            <v-card-text>
                                <v-progress-linear v-model="infos.seasons.length" :max="seasons.length" rounded />
                            </v-card-text>
                        </v-col>
                    </v-row>
                </v-card>

                <seasons-row :loading="loading" :seasons="infos.seasons" />
            </v-window-item>

            <v-window-item :value="2">
                <seasons-row :loading="loading" :seasons="seasons">
                    <template #add>
                        <v-btn color="surface-variant" icon="mdi-tray-plus" variant="text" @click="" />
                    </template>
                </seasons-row>
            </v-window-item>
        </v-window>
    </v-container>

    <base-dialog v-model="dialog" title="Supprimer" text="Confirmez-vous la suppression de la série ?"
        @cancel="dialog = false" @confirm="removeSerie" />
</template>

<script lang="ts" setup>
import BaseDialog from "@/components/BaseDialog.vue";
import BaseImage from "@/components/BaseImage.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import SeasonsRow from "@/components/SeasonsRow.vue";
import type { SerieInfos } from "@/models/internal/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import type { Season } from "@/models/internal/season";
import router from "@/router";
import { minsToStringHoursDays } from "@/utils/format";

const props = defineProps({
    id: { type: Number, required: true }
});

const { deleteSerie, getSerie, updateFavorite } = useSerie();
const { getSeasonsBySerieId } = useSearch();

const dialog = ref(false);
const infos = ref<SerieInfos>();
const isFavorite = ref(false);
const loading = ref(false);
const seasons = ref<Season[]>();
const tab = ref(1);

const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerie({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    isFavorite.value = infos.value?.serie.favorite;
    loading.value = false;
}

const changeFavorite = async () => {
    if (!infos.value?.serie) return
    await updateFavorite(infos.value?.serie);
    isFavorite.value = !isFavorite.value;
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