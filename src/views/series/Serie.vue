<template>
    <v-container v-if="infos && seasons">
        <base-toolbar icon="mdi-chevron-left" :title="infos.serie.title" @back="$router.back()">
            <template #firstBtn>
                <v-btn icon @click="changeFavorite">
                    <v-icon :color="favoriteColor" :icon="FAVORITE_ICON" />
                </v-btn>
            </template>

            <template #secondBtn>
                <v-btn icon @click="confirm = true">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </base-toolbar>

        <v-card class="mb-2 pa-2">
            <v-row>
                <v-col cols="3">
                    <base-image :src="infos.serie.poster" max-height="350" />
                </v-col>
                <v-col cols="9">
                    <p class="mb-1 text-subtitle-1">Saisons {{ infos.seasons.length }} / {{ seasons.length }}</p>
                    <v-progress-linear v-model="infos.seasons.length" class="mb-3 text-subtitle-1" :max="seasons.length"
                        rounded />
                    <p class="mb-1 text-subtitle-1">{{ infos.episodes }} épisodes</p>
                    <p class="mb-1 text-subtitle-1">{{ time }}</p>
                </v-col>
            </v-row>
        </v-card>

        <v-card class="mb-2">
            <v-tabs v-model="tab" align-tabs="title">
                <v-tab :value="1">Mes saisons</v-tab>
                <v-tab :value="2">Ajouter</v-tab>
            </v-tabs>
        </v-card>

        <v-btn v-if="displayOrder" @click="orderSeasons" class="mb-2 ms-1">
            <v-icon>{{ orderIcon }}</v-icon>
        </v-btn>

        <v-window v-model="tab" class="pa-1">
            <v-window-item :value="1">
                <seasons-row :loading="loading" :seasons="infos.seasons" @show-season="showSeason" />
            </v-window-item>
            <v-window-item :value="2">
                <seasons-row addable :loading="loading" :seasons="seasons" @add="newSeason" />
            </v-window-item>
        </v-window>
    </v-container>

    <base-modal v-if="selected" v-model="modal" :max-width="500">
        <template #title>
            <span>Saison {{ selected.number }}</span>
            <v-btn icon="mdi-close" variant="text" @click="modal = false" />
        </template>
        <season-details :id="id" :season="selected" />
    </base-modal>

    <base-confirm v-model="confirm" title="Supprimer" text="Confirmez-vous la suppression de la série ?"
        @cancel="confirm = false" @confirm="removeSerie" />
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseConfirm from "@/components/BaseConfirm.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseImage from "@/components/BaseImage.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import SeasonDetails from "@/components/SeasonDetails.vue";
import SeasonsRow from "@/components/SeasonsRow.vue";
import type { SerieInfo } from "@/models/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSeason } from "@/composables/season";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import type { Season } from "@/models/season";
import router from "@/router";
import { minsToStringHoursDays } from "@/utils/format";
import { FAVORITE_ICON } from "@/constants/icons";
import { useSnackbar } from "@/composables/snackbar";

const props = defineProps({
    id: { type: Number, required: true }
});

const { addSeason } = useSeason();
const { deleteSerie, getSerie, updateFavorite } = useSerie();
const { getSeasonsBySerieId } = useSearch();
const { showError } = useSnackbar();

const confirm = ref(false);
const infos = ref<SerieInfo>();
const isFavorite = ref(false);
const loading = ref(false);
const modal = ref(false);
const order = ref(false);
const seasons = ref<Season[]>();
const selected = ref<Season>();
const tab = ref(1);

const displayOrder = computed(() => [1, 2].includes(tab.value));
const favoriteColor = computed(() => isFavorite.value ? "red" : "surface-variant");
const orderIcon = computed(() => order.value ? "mdi-sort-numeric-descending" : "mdi-sort-numeric-ascending");
const time = computed(() => minsToStringHoursDays(infos.value?.time));

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerie({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    isFavorite.value = infos.value?.serie.favorite;
    loading.value = false;
}

const orderSeasons = (): void => {
    const func = (a: Season, b: Season) => order.value ? a.number - b.number : b.number - a.number;
    tab.value === 1 ? infos.value?.seasons.sort(func) : seasons.value?.sort(func);
    order.value = !order.value;
}

const newSeason = async (season: Season): Promise<void> => {
    if (!infos.value?.serie) {
        showError("Impossible d'ajouter une saison");
        return
    }
    await addSeason(infos.value.serie, season);
}

const changeFavorite = async (): Promise<void> => {
    if (!infos.value?.serie) {
        showError("Impossible d'ajouter en favoris");
        return
    }
    await updateFavorite(infos.value?.serie);
    isFavorite.value = !isFavorite.value;
}

const removeSerie = async (): Promise<void> => {
    if (!infos.value?.serie) {
        showError("Impossible de supprimer la série");
        return
    }
    confirm.value = !await deleteSerie(infos.value?.serie);
    router.replace("/series");
}

const showSeason = (season: Season): void => {
    selected.value = season;
    modal.value = true;
}

onBeforeMount(async () => {
    await load();
});
</script>