<template>
    <v-container v-if="infos">
        <base-toolbar icon="mdi-chevron-left" :title="infos.serie.title">
            <template #buttons>
                <button-details-serie :serie-id="id" />
                <button-favorite-serie :serie-id="id" />
                <button-watch-serie :serie-id="id" />
                <button-update-serie :serie="infos.serie" @update="updateModal = true" />
                <button-remove-serie :serie="infos.serie" />
            </template>
        </base-toolbar>
        <v-row>
            <v-col v-if="infos.serie.poster" cols="12" sm="3">
                <base-image :src="infos.serie.poster" max-height="350" />
            </v-col>
            <v-col cols="12" sm="9">
                <v-card>
                    <v-card-title class="text-overline">
                        <div class="text-h4 font-weight-bold">{{ viewingPercent }}%</div>

                        <div class="text-h6 text-medium-emphasis font-weight-regular">
                            {{ buildPlural("Saison", infos.seasons.length, false, false) }}
                            {{ infos.seasons.length }} / {{ seasons.length }}
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <v-progress-linear height="20" :model-value="viewingPercent" rounded="lg" />

                        <div class="d-flex flex-column py-3 ga-2">
                            <span class="font-weight-bold">
                                Durée d'un épisode : {{ buildPlural("min", infos.serie.duration) }}
                            </span>
                            <span class="font-weight-bold">
                                Episodes vus : {{ infos.episodes }}
                            </span>
                            <span class="font-weight-bold">
                                Temps de visionnage : {{ time }}
                            </span>
                            <span v-if="isMissingSeasons" class="font-weight-bold">
                                Temps restant : {{ missingTime }}
                            </span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-card class="my-2">
            <v-tabs v-model="tab">
                <v-tab :value="1">Mes saisons</v-tab>
                <v-tab :value="2">Ajouter</v-tab>
                <v-tab :value="3">Vue par</v-tab>
            </v-tabs>
        </v-card>

        <v-window v-model="tab" class="pa-1">
            <v-window-item :value="1">
                <seasons-row :loading="loading" :seasons="infos.seasons" @show-season="showSeason" />
            </v-window-item>
            <v-window-item :value="2">
                <seasons-row addable :loading="loading" :seasons="seasons" @add-season="newSeason" @show-season="showSeason" />
            </v-window-item>
            <v-window-item :value="3" @group:selected="getFriendsWhoWatch">
                <friends-row consult :friends="friends" />
            </v-window-item>
        </v-window>
    </v-container>

    <base-confirm v-if="infos?.serie" v-model="confirmModal" title="Supprimer"
        text="Confirmez-vous la suppression de la série ?" @cancel="confirmModal = false"
        @confirm="deleteSerie(infos.serie)" />

    <base-modal v-if="selected" v-model="modal">
        <template #title>
            <span>Saison {{ selected.number }}</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="modal = false" />
        </template>
        <season-episodes v-if="isAddable" :id="id" :number="selected.number" />
        <season-details v-else :id="id" :season="selected" @refresh="refresh" />
    </base-modal>

    <base-modal v-model="updateModal">
        <template #title>
            <span>Modifier la date d'ajout</span>
            <v-btn :icon="CLOSE_ICON" variant="text" @click="updateModal = false" />
        </template>
        <v-text-field v-model="addedAt" type="datetime-local" :max="maxDate" />

        <div class="d-flex justify-end">
            <v-btn elevation="0" @click="updateSerie" :color="MAIN_COLOR">Enregistrer</v-btn>
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import ButtonUpdateSerie from "@/components/buttons/ButtonUpdateSerie.vue";
import ButtonWatchSerie from "@/components/buttons/ButtonWatchSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonRemoveSerie from "@/components/buttons/ButtonRemoveSerie.vue";
import ButtonDetailsSerie from "@/components/buttons/ButtonDetailsSerie.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseImage from "@/components/BaseImage.vue";
import BaseToolbar from "@/components/BaseToolbar.vue";
import SeasonDetails from "@/components/seasons/SeasonDetails.vue";
import SeasonEpisodes from "@/components/seasons/SeasonEpisodes.vue";
import SeasonsRow from "@/components/seasons/SeasonsRow.vue";
import FriendsRow from "@/components/friends/FriendsRow.vue";
import type { SerieInfo } from "@/models/serie";
import { computed, onBeforeMount, ref } from "vue";
import { useSeason } from "@/composables/season";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import type { Season } from "@/models/season";
import { buildPlural, formatDateTime, minsToStringHoursDays } from "@/utils/format";
import { CLOSE_ICON } from "@/constants/icons";
import type { User } from "@/models/user";
import { useFriend } from "@/composables/friend";
import { useState } from "@/composables/state";
import { FriendStatus } from "@/types/types";
import { MAIN_COLOR } from "@/constants/style";
import { useSnackbar } from "@/composables/snackbar";

const props = defineProps({
    id: { type: Number, required: true }
});

const maxDate = new Date().toISOString().slice(0, 16);

const { confirmModal } = useState();
const { getFriends } = useFriend();
const { addSeason } = useSeason();
const { deleteSerie, getSerieInfos, updateField} = useSerie();
const { getSeasonsBySerieId, getPlatforms } = useSearch();
const { showSuccess, showError } = useSnackbar();

const friends = ref<User[]>([]);
const infos = ref<SerieInfo>();
const isFavorite = ref(false);
const isWatching = ref(false);
const loading = ref(false);
const modal = ref(false);
const seasons = ref<Season[]>([]);
const selected = ref<Season>();
const tab = ref(1);
const isAddable = ref(false);
const updateModal = ref(false);
const addedAt = ref<string>();

const missingTime = computed(() => { 
    const allSeasons = seasons.value;
    const viewedSeasons = infos.value?.seasons ?? [];
    let missingEpisodes = 0;

    for (const season of allSeasons) {
        const viewed = viewedSeasons.find((s) => s.number === season.number);
        if (viewed) continue;
        missingEpisodes += season.episodes;
    }
    return minsToStringHoursDays(missingEpisodes * (infos.value?.serie.duration ?? 0));
});
const isMissingSeasons = computed(() => seasons.value.length - (infos.value?.seasons?.length ?? 0) > 0);
const time = computed(() => minsToStringHoursDays(infos.value?.time));
const viewingPercent = computed(() => ((infos.value?.seasons.length ?? 0) / seasons.value.length * 100).toFixed(0));

const refresh = async () => {
    modal.value = false;
    await load();
}

const load = async (): Promise<void> => {
    loading.value = true;
    infos.value = await getSerieInfos({ id: props.id });
    seasons.value = await getSeasonsBySerieId(props.id);
    isFavorite.value = infos.value?.serie.favorite ?? false;
    isWatching.value = infos.value?.serie.watch ?? false;

    if (infos.value?.serie.addedAt) {
        addedAt.value = formatDateTime(infos.value.serie.addedAt);
    }
    loading.value = false;
}

const newSeason = async (season: Season): Promise<void> => {
    await addSeason(infos.value!.serie, season);
    infos.value = await getSerieInfos({ id: props.id });
    showSeason(season, false);
}

const showSeason = (season: Season, addable: boolean): void => {
    isAddable.value = addable;
    selected.value = season;
    modal.value = true;
}

const getFriendsWhoWatch = async (): Promise<void> => {
    if (friends.value.length) return;
    loading.value = true;
    friends.value = (await getFriends(FriendStatus.Viewed, props.id)).viewed;
    loading.value = false;
}

const updateSerie = async (): Promise<void> => {
    if (!infos.value?.serie || !addedAt.value) return;

    if (new Date(addedAt.value) > new Date(maxDate)) {
        showError("Date d'ajout invalide");
        return;
    }
    const updated = await updateField(infos.value.serie, "addedAt", addedAt.value);

    if (!updated) {
        showError("Impossible de modifier la date d'ajout de la série");
        return;
    }
    infos.value.serie.addedAt = addedAt.value;
    showSuccess("Date d'ajout de la série modifiée");
    updateModal.value = false;
}

onBeforeMount(async () => {
    await load();
    await getPlatforms();
});
</script>