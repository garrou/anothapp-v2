<template>
    <template v-if="seasons.length">
        <div class="season-details-total">{{ minsToStringHoursDays(time) }}</div>

        <div v-for="subSeason in seasons" :key="subSeason.id" class="season-entry">
            <div class="season-entry-row">
                <platform-card class="season-entry-platform" :platform="subSeason.platform" />

                <div class="season-entry-info">
                    <div class="season-entry-date">{{ formatDate(subSeason.addedAt) }}</div>
                    <div class="season-entry-subtitle">{{ subSeason.platform.name }}</div>
                </div>

                <v-btn v-if="!isEdited(subSeason.id)" class="season-entry-btn" :icon="EDIT_ICON" size="32"
                    variant="text" @click="editSeason(subSeason.id)" />
                <v-btn class="season-entry-btn" :icon="DELETE_ICON" size="32" variant="text"
                    @click="selectSeason(subSeason.id)" />
            </div>

            <div v-if="isEdited(subSeason.id)" class="season-entry-edit">
                <v-label class="season-entry-label">Plateforme</v-label>
                <v-select v-model="seasonInfo.platform" class="mb-3" :density="DENSITY" hide-details
                    :items="platforms" item-title="name" item-value="id" />
                <v-text-field v-model="seasonInfo.viewedAt" class="mb-3" hide-details type="datetime-local" />

                <v-btn block color="primary" rounded="pill" @click="changeSeason">Enregistrer</v-btn>
            </div>

            <div v-if="bulkOfferSeasonId === subSeason.id" class="season-entry-edit">
                <p class="mb-3">Marquer tous les épisodes diffusés de cette saison comme vus ?</p>
                <div class="d-flex ga-2">
                    <v-btn class="flex-grow-1" color="primary" rounded="pill" @click="acceptBulkAdd(subSeason.id)">
                        Tout marquer
                    </v-btn>
                    <v-btn class="flex-grow-1" rounded="pill" variant="outlined" @click="bulkOfferSeasonId = -1">
                        Non merci
                    </v-btn>
                </div>
            </div>

            <episodes-checklist v-if="episodeTrackingEnabled" class="mt-3" :key="`${subSeason.id}-${episodesRefreshKey}`"
                :user-season-id="subSeason.id" @refresh="onEpisodesRefresh" />
        </div>
    </template>

    <base-confirm v-model="modal" text="Supprimer ce visionnage ?" title="Supprimer" persistent @cancel="modal = false"
        @confirm="dropSeason(selected)" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import type { PropType } from "vue";
import { onBeforeMount, reactive, ref, watch } from "vue";
import type { Season, SeasonDetail } from "@/models/season";
import { useSeason } from "@/composables/season";
import { useEpisode } from "@/composables/episode";
import { formatDate, formatDateTime, minsToStringHoursDays } from "@/utils/format";
import { DENSITY } from "@/constants/style";
import { EDIT_ICON, DELETE_ICON } from "@/constants/icons";
import { useSerie } from "@/composables/serie";
import type { Platform } from "@/models/serie";
import { useSearch } from "@/composables/search";
import { useUser } from "@/composables/user";
import { usePlatform } from "@/composables/platform";
import PlatformCard from "../series/PlatformCard.vue";
import EpisodesChecklist from "./EpisodesChecklist.vue";

const props = defineProps({
    id: { type: Number, required: true },
    justAdded: { type: Boolean, default: false },
    season: { type: Object as PropType<Season>, required: true }
});

const emit = defineEmits<{
    refresh: []
    refreshStats: []
}>();

const { getPlatforms } = useSearch();
const { getSerie } = useSerie();
const { deleteSeason, getSeasonInfosBySerieIdByNumber, getSeasonWatchedTime, updateSeason } = useSeason();
const { addAllEpisodesViewing } = useEpisode();
const { getProfile } = useUser();
const { getUserPlatforms } = usePlatform();

const modal = ref(false);
const seasons = ref<SeasonDetail[]>([]);
const selected = ref(-1);
const time = ref(0);
const toEdit = ref(-1);
const episodeTrackingEnabled = ref(false);
const platforms = ref<Platform[]>([]);
const bulkOfferSeasonId = ref(-1);
const episodesRefreshKey = ref(0);
const seasonInfo = reactive({
    platform: 0,
    viewedAt: ""
});

const isEdited = (id: number): boolean => toEdit.value === id;

const editSeason = (id: number) => {
    toEdit.value = isEdited(id) ? -1 : id;
}

const selectSeason = (id: number) => {
    selected.value = id;
    modal.value = true;
}

const refreshTime = async () => {
    if (episodeTrackingEnabled.value) {
        time.value = (await getSeasonWatchedTime(props.id, props.season.number)) ?? 0;
    }
}

const acceptBulkAdd = async (userSeasonId: number) => {
    bulkOfferSeasonId.value = -1;
    await addAllEpisodesViewing(userSeasonId);
    episodesRefreshKey.value++;
    await refreshTime();
    emit("refreshStats");
}

const onEpisodesRefresh = async () => {
    await refreshTime();
    emit("refreshStats");
}

const dropSeason = async (id: number) => {
    await deleteSeason(id);
    modal.value = false;
    emit("refresh");
}

const changeSeason = async () => {
    const updated = await updateSeason(toEdit.value, seasonInfo.platform, seasonInfo.viewedAt);
    if (!updated) return;

    const idx = seasons.value.map((s) => s.id).indexOf(toEdit.value);
    if (idx < 0 || !seasonInfo.viewedAt || !seasonInfo.platform) return;

    const newPlatform = platforms.value.find((s) => s.id === seasonInfo.platform);
    if (!newPlatform) return;

    seasons.value[idx].addedAt = formatDateTime(seasonInfo.viewedAt);
    seasons.value[idx].platform = newPlatform;
}

watch(toEdit, () => {
    const season = seasons.value.find((s) => s.id === toEdit.value);

    if (!season) {
        editSeason(toEdit.value);
        return;
    };
    seasonInfo.platform = season.platform.id;
    seasonInfo.viewedAt = formatDateTime(season.addedAt);
});

onBeforeMount(async () => {
    const [allPlatforms, userPlatformIds] = await Promise.all([getPlatforms(), getUserPlatforms()]);
    platforms.value = [
        ...allPlatforms.filter((p) => userPlatformIds.includes(p.id)),
        ...allPlatforms.filter((p) => !userPlatformIds.includes(p.id))
    ];
    seasons.value = await getSeasonInfosBySerieIdByNumber(props.id, props.season.number);
    const user = await getProfile();
    episodeTrackingEnabled.value = user.episodeTrackingEnabled ?? false;

    // Offer to bulk-mark the season's episodes right after adding it, so
    // newcomers catching up on an already-aired season don't have to check
    // every episode one by one. `seasons` is ordered by addedAt, so the
    // viewing just created is the last entry.
    if (episodeTrackingEnabled.value && props.justAdded && seasons.value.length) {
        bulkOfferSeasonId.value = seasons.value[seasons.value.length - 1].id;
    }

    if (episodeTrackingEnabled.value) {
        await refreshTime();
    } else {
        const serie = await getSerie({ id: props.id });
        time.value = serie.duration * props.season.episodes * seasons.value.length;
    }
});
</script>

<style scoped>
.season-details-total {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 12px;
}

.season-entry {
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 12px;
    padding: 8px 12px;
    margin-bottom: 10px;
}

.season-entry-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.season-entry-info {
    flex: 1;
    min-width: 0;
}

.season-entry-date {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.season-entry-subtitle {
    font-size: 12px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.season-entry-btn {
    flex-shrink: 0;
}

.season-entry-edit {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgb(var(--v-border-color));
}

.season-entry-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
