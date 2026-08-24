<template>
    <v-expansion-panels>
        <v-expansion-panel title="Épisodes">
            <v-expansion-panel-text>
                <div v-for="episode in episodes" :key="episode.episodeId" class="episode-entry">
                    <div class="episode-entry-row">
                        <div class="episode-entry-info">
                            <div class="episode-entry-title">#{{ episode.global }} {{ episode.title }}</div>
                            <div class="episode-entry-subtitle">{{ episode.code }}</div>
                        </div>

                        <v-chip v-if="!isAired(episode)" size="small" variant="outlined">À venir</v-chip>

                        <template v-else-if="episode.watchedAt">
                            <platform-card :platform="getSpecificPlatform(episode.platformId)" />
                            <div class="episode-entry-date">{{ formatDate(episode.watchedAt) }}</div>
                            <v-btn v-if="!isEdited(episode.episodeId)" class="episode-entry-btn" :icon="EDIT_ICON"
                                size="32" variant="text" @click="editEpisode(episode.episodeId)" />
                            <v-btn class="episode-entry-btn" :icon="DELETE_ICON" size="32" variant="text"
                                @click="removeViewing(episode)" />
                        </template>

                        <v-btn v-else class="episode-entry-btn" :color="MAIN_COLOR" :icon="ADD_ICON" size="32"
                            variant="text" @click="addViewing(episode)" />
                    </div>

                    <div v-if="isEdited(episode.episodeId)" class="episode-entry-edit">
                        <v-label class="episode-entry-label">Plateforme</v-label>
                        <v-select v-model="platformInput" class="mb-3" :density="DENSITY" hide-details
                            :items="platforms" item-title="name" item-value="id" />
                        <v-text-field v-model="watchedAtInput" class="mb-3" hide-details type="datetime-local" />

                        <v-btn block color="primary" rounded="pill" @click="saveEpisode(episode)">Enregistrer</v-btn>
                    </div>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from "vue";
import { useEpisode } from "@/composables/episode";
import { useSearch } from "@/composables/search";
import type { UserEpisode } from "@/models/userEpisode";
import type { Platform } from "@/models/serie";
import { formatDate, formatDateTime } from "@/utils/format";
import { DENSITY, MAIN_COLOR } from "@/constants/style";
import { ADD_ICON, EDIT_ICON, DELETE_ICON } from "@/constants/icons";
import PlatformCard from "@/components/series/PlatformCard.vue";

const props = defineProps({
    userSeasonId: { type: Number, required: true }
});

const { getEpisodesBySeasonId, addEpisodeViewing, updateEpisodeViewing, deleteEpisodeViewing } = useEpisode();
const { getPlatforms } = useSearch();

const episodes = ref<UserEpisode[]>([]);
const platforms = ref<Platform[]>([]);
const toEdit = ref(-1);
const watchedAtInput = ref("");
const platformInput = ref(0);

const isAired = (episode: UserEpisode): boolean => !!episode.date && new Date(episode.date) <= new Date();
const isEdited = (episodeId: number): boolean => toEdit.value === episodeId;
const getSpecificPlatform = (id: number | null): Platform | undefined => platforms.value.find((p) => p.id === id);

const load = async (): Promise<void> => {
    episodes.value = await getEpisodesBySeasonId(props.userSeasonId);
}

const editEpisode = (episodeId: number): void => {
    toEdit.value = isEdited(episodeId) ? -1 : episodeId;
}

const addViewing = async (episode: UserEpisode): Promise<void> => {
    await addEpisodeViewing(props.userSeasonId, episode.episodeId);
    await load();
}

const removeViewing = async (episode: UserEpisode): Promise<void> => {
    if (!episode.id) return;
    await deleteEpisodeViewing(episode.id);
    await load();
}

const saveEpisode = async (episode: UserEpisode): Promise<void> => {
    if (!episode.id || !watchedAtInput.value || !platformInput.value) return;
    await updateEpisodeViewing(episode.id, formatDateTime(watchedAtInput.value), platformInput.value);
    toEdit.value = -1;
    await load();
}

watch(toEdit, () => {
    const episode = episodes.value.find((e) => e.episodeId === toEdit.value);
    watchedAtInput.value = episode?.watchedAt ? formatDateTime(episode.watchedAt) : "";
    platformInput.value = episode?.platformId ?? 0;
});

onBeforeMount(async () => {
    platforms.value = await getPlatforms();
    await load();
});
</script>

<style scoped>
.episode-entry {
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 12px;
    padding: 8px 12px;
    margin-bottom: 10px;
}

.episode-entry-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.episode-entry-info {
    flex: 1;
    min-width: 0;
}

.episode-entry-title {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.episode-entry-subtitle {
    font-size: 12px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.episode-entry-date {
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
}

.episode-entry-btn {
    flex-shrink: 0;
}

.episode-entry-edit {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgb(var(--v-border-color));
}

.episode-entry-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgb(var(--v-theme-on-surface-variant));
}
</style>
