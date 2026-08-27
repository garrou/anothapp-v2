<template>
    <div v-if="infos">
        <serie-hero :poster="infos.serie.poster" :kinds="infos.serie.kinds" :title="infos.serie.title" @back="goBack" />

        <v-container>
            <v-card class="overview mb-6" rounded="lg">
                <div class="ring-wrap">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="54" fill="none" class="ring-track" stroke-width="10" />
                        <circle cx="64" cy="64" r="54" fill="none" class="ring-value-circle" stroke-width="10"
                            stroke-linecap="round" :stroke-dasharray="ringCircumference"
                            :stroke-dashoffset="ringOffset" transform="rotate(-90 64 64)" />
                    </svg>
                    <div class="ring-center">
                        <div class="ring-value">{{ viewingPercent }}%</div>
                        <div class="ring-label">
                            {{ buildPlural("Saison", infos.seasons.length, false, false) }}
                            {{ infos.seasons.length }} / {{ seasons.length }}
                        </div>
                    </div>
                </div>
                <div class="overview-stats">
                    <stat-tile label="Episodes vus" :value="infos.episodes" />
                    <stat-tile label="Temps de visionnage" :value="time" />
                    <stat-tile v-if="isMissingSeasons" label="Temps restant" :value="missingTime" />
                    <stat-tile label="Durée d'un épisode" :value="`${infos.serie.duration} min`" />
                </div>
            </v-card>

            <div class="actions-row mb-6">
                <button-watch-serie :serie="infos.serie" primary />
                <button-favorite-serie :serie-id="id" />

                <base-menu open-on-click>
                    <button-details-serie :serie="infos.serie" menu-item />
                    <button-update-serie :serie="infos.serie" menu-item @update="updateModal = true" />
                    <v-list-item prepend-icon="mdi-account-heart" title="Amis qui regardent cette série"
                        @click="openFriendsModal" />
                    <v-divider class="my-1" />
                    <button-remove-serie :serie="infos.serie" menu-item />
                </base-menu>
            </div>

            <v-chip-group v-model="infos.serie.note" class="mb-6" :selected-class="'bg-primary'"
                @update:model-value="updateSerieNote">
                <v-chip v-for="n in notes" :key="n.id" :value="n.id" :color="NOTE_COLORS[n.id]">
                    <v-icon v-if="n.id == infos.serie.note" class="mr-2" :icon="NOTE_ICONS[n.id]" />
                    <span>{{ n.name }}</span>
                </v-chip>
            </v-chip-group>

            <pill-tabs v-model="tab" class="mb-4" :tabs="SERIE_TABS" />

            <v-window v-model="tab" class="pa-1">
                <v-window-item :value="1">
                    <seasons-row :loading="loading" :seasons="infos.seasons" @show-season="showSeason" />
                </v-window-item>
                <v-window-item :value="2">
                    <seasons-row addable :loading="loading" :seasons="seasons" @add-season="newSeason"
                        @show-season="showSeason" />
                </v-window-item>
            </v-window>
        </v-container>
    </div>

    <base-confirm v-if="infos?.serie" v-model="confirmModal" title="Supprimer"
        text="Confirmez-vous la suppression de la série ?" @cancel="confirmModal = false"
        @confirm="deleteSerie(infos.serie)" />

    <base-modal v-if="selected" v-model="modal" :title="`Saison ${selected.number}`">
        <season-episodes v-if="isAddable" :id="id" :number="selected.number" />
        <season-details v-else :id="id" :season="selected" :just-added="justAddedSeason" @refresh="refresh"
            @refresh-stats="refreshStats" />
    </base-modal>

    <base-modal v-model="friendsModal" title="Amis qui regardent cette série">
        <friends-row consult :friends="friends" :loading="loading" />
    </base-modal>

    <base-modal v-model="updateModal" title="Modifier la date d'ajout">
        <v-text-field v-model="showInfo.addedAt" type="datetime-local" :max="maxDate" />

        <div class="d-flex justify-end">
            <v-btn elevation="0" @click="updateSerieDate" :color="MAIN_COLOR">Enregistrer</v-btn>
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import BaseMenu from "@/components/BaseMenu.vue";
import ButtonUpdateSerie from "@/components/buttons/ButtonUpdateSerie.vue";
import ButtonWatchSerie from "@/components/buttons/ButtonWatchSerie.vue";
import ButtonFavoriteSerie from "@/components/buttons/ButtonFavoriteSerie.vue";
import ButtonRemoveSerie from "@/components/buttons/ButtonRemoveSerie.vue";
import ButtonDetailsSerie from "@/components/buttons/ButtonDetailsSerie.vue";
import BaseModal from "@/components/BaseModal.vue";
import StatTile from "@/components/StatTile.vue";
import SeasonDetails from "@/components/seasons/SeasonDetails.vue";
import SeasonEpisodes from "@/components/seasons/SeasonEpisodes.vue";
import SeasonsRow from "@/components/seasons/SeasonsRow.vue";
import FriendsRow from "@/components/friends/FriendsRow.vue";
import SerieHero from "@/components/series/SerieHero.vue";
import PillTabs from "@/components/PillTabs.vue";
import type { SerieInfo } from "@/models/serie";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useSeason } from "@/composables/season";
import { useSearch } from "@/composables/search";
import { useSerie } from "@/composables/serie";
import type { Season } from "@/models/season";
import { buildPlural, formatDateTime, minsToStringHoursDays } from "@/utils/format";
import { NOTE_ICONS } from "@/constants/icons";
import type { User } from "@/models/user";
import { useFriend } from "@/composables/friend";
import { useState } from "@/composables/state";
import { FriendStatus } from "@/types/types";
import { MAIN_COLOR, NOTE_COLORS } from "@/constants/style";
import { useSnackbar } from "@/composables/snackbar";
import type { Note } from "@/models/note";
import { goBack as navigateBack } from "@/utils/navigation";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true }
});

const SERIE_TABS = [
    { value: 1, label: "Mes saisons" },
    { value: 2, label: "Ajouter" }
];

const maxDate = new Date().toISOString().slice(0, 16);

const router = useRouter();
const { confirmModal } = useState();
const { getFriends } = useFriend();
const { addSeason } = useSeason();
const { deleteSerie, getSerieInfos, updateField, getSerieFromCache } = useSerie();
const { getSeasonsBySerieId, getPlatforms, getNotes } = useSearch();
const { showSuccess, showError } = useSnackbar();

const friends = ref<User[]>([]);
const friendsModal = ref(false);
const infos = ref<SerieInfo>();
const loading = ref(false);
const modal = ref(false);
const seasons = ref<Season[]>([]);
const selected = ref<Season>();
const notes = ref<Note[]>([]);
const tab = ref(1);
const isAddable = ref(false);
const justAddedSeason = ref(false);
const updateModal = ref(false);
const showInfo = reactive({
    isFavorite: false,
    isWatching: false,
    addedAt: ""
});

const ringCircumference = 2 * Math.PI * 54;

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
const totalEpisodes = computed(() => seasons.value.reduce((acc, season) => acc + season.episodes, 0));

const viewingPercent = computed(() => {
    if (infos.value?.distinctEpisodes !== undefined && totalEpisodes.value) {
        return (infos.value.distinctEpisodes / totalEpisodes.value * 100).toFixed(0);
    }
    if (!seasons.value.length) {
        return "0";
    }
    return ((infos.value?.seasons.length ?? 0) / seasons.value.length * 100).toFixed(0);
});
const ringOffset = computed(() => ringCircumference * (1 - Number(viewingPercent.value) / 100));

const goBack = () => navigateBack(router, "/series");

const refresh = async () => {
    modal.value = false;
    await load();
}

const refreshStats = async () => {
    infos.value = await getSerieInfos({ id: props.id });
}

const load = async (): Promise<void> => {
    loading.value = true;

    try {
        const exists = !!(await getSerieFromCache(props.id));

        if (!exists) {
            navigateBack(router, "/series");
            return;
        }
        infos.value = await getSerieInfos({ id: props.id });
        seasons.value = await getSeasonsBySerieId(props.id);
        showInfo.isFavorite = infos.value?.serie.favorite ?? false;
        showInfo.isWatching = infos.value?.serie.watch ?? false;

        if (infos.value?.serie.addedAt) {
            showInfo.addedAt = formatDateTime(infos.value.serie.addedAt);
        }
    } finally {
        loading.value = false;
    }
}

const newSeason = async (season: Season): Promise<void> => {
    await addSeason(infos.value!.serie, season);
    infos.value = await getSerieInfos({ id: props.id });
    showSeason(season, false);
    justAddedSeason.value = true;
}

const showSeason = (season: Season, addable: boolean): void => {
    isAddable.value = addable;
    selected.value = season;
    modal.value = true;
    justAddedSeason.value = false;
}

const openFriendsModal = async (): Promise<void> => {
    friendsModal.value = true;

    if (friends.value.length) return;
    loading.value = true;
    friends.value = (await getFriends(FriendStatus.Viewed, props.id)).viewed;
    loading.value = false;
}

const updateSerieDate = async (): Promise<void> => {
    if (!infos.value?.serie || !showInfo.addedAt) return;

    if (new Date(showInfo.addedAt) > new Date(maxDate)) {
        showError("Date d'ajout invalide");
        return;
    }
    const updated = await updateField(infos.value.serie, "addedAt", showInfo.addedAt);

    if (!updated) {
        showError("Impossible de modifier la date d'ajout de la série");
        return;
    }
    infos.value.serie.addedAt = showInfo.addedAt;
    showSuccess("Date d'ajout de la série modifiée");
    updateModal.value = false;
}

const updateSerieNote = async (): Promise<void> => {
    if (!infos.value?.serie || !infos.value.serie.note) return;
    const updated = await updateField(infos.value.serie, "note", infos.value.serie.note);

    if (!updated) {
        showError("Impossible de modifier la note de la série");
        return;
    }
    showSuccess("Note modifiée");
}

const loadNotes = async () => {
    notes.value = await getNotes();
}

watch(() => props.id, () => {
    tab.value = 1;
    friends.value = [];
    load();
});

onBeforeMount(async () => {
    await Promise.all([
        load(),
        getPlatforms(),
        loadNotes()
    ]);
});
</script>

<style scoped>
.overview {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 28px;
    padding: 24px 28px;
}

.ring-wrap {
    position: relative;
    width: 128px;
    height: 128px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ring-track {
    stroke: rgb(var(--v-theme-surface-variant));
}

.ring-value-circle {
    stroke: rgb(var(--v-theme-primary));
    transition: stroke-dashoffset 0.4s ease;
}

.ring-center {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    text-align: center;
}

.ring-value {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 24px;
}

.ring-label {
    font-size: 10.5px;
    color: rgb(var(--v-theme-on-surface-variant));
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.overview-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    flex: 1;
}

.actions-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
