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
                            <div class="episode-entry-date">{{ formatDate(episode.watchedAt) }}</div>
                            <v-btn v-if="!isEdited(episode.episodeId)" class="episode-entry-btn" :icon="EDIT_ICON"
                                size="32" variant="text" @click="editEpisode(episode.episodeId)" />
                            <v-btn class="episode-entry-btn" :icon="DELETE_ICON" size="32" variant="text"
                                @click="selectViewing(episode)" />
                        </template>

                        <v-btn v-else class="episode-entry-btn" :color="MAIN_COLOR" :icon="ADD_ICON" size="32"
                            variant="text" @click="addViewing(episode)" />
                    </div>

                    <p v-if="episode.description" class="episode-entry-description">{{ episode.description }}</p>

                    <div v-if="isEdited(episode.episodeId)" class="episode-entry-edit">
                        <v-text-field v-model="watchedAtInput" class="mb-3" hide-details type="datetime-local" />

                        <v-btn block color="primary" rounded="pill" @click="saveViewedAt(episode)">Enregistrer</v-btn>
                    </div>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <base-confirm v-model="modal" text="Supprimer ce visionnage ?" title="Supprimer" persistent @cancel="modal = false"
        @confirm="removeViewing" />
</template>

<script lang="ts" setup>
import BaseConfirm from "@/components/BaseConfirm.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useEpisode } from "@/composables/episode";
import type { UserEpisode } from "@/models/userEpisode";
import { formatDate, fromDatetimeLocalInput, toDatetimeLocalInput } from "@/utils/format";
import { MAIN_COLOR } from "@/constants/style";
import { ADD_ICON, EDIT_ICON, DELETE_ICON } from "@/constants/icons";

const props = defineProps({
    userSeasonId: { type: Number, required: true }
});

const emit = defineEmits<{
    refresh: []
}>();

const { getEpisodesBySeasonId, addEpisodeViewing, updateEpisodeViewing, deleteEpisodeViewing } = useEpisode();

const episodes = ref<UserEpisode[]>([]);
const toEdit = ref(-1);
const watchedAtInput = ref("");
const modal = ref(false);
const selected = ref<UserEpisode>();

const isAired = (episode: UserEpisode): boolean => !!episode.date && new Date(episode.date) <= new Date();
const isEdited = (episodeId: number): boolean => toEdit.value === episodeId;

const load = async (): Promise<void> => {
    episodes.value = await getEpisodesBySeasonId(props.userSeasonId);
}

const editEpisode = (episodeId: number): void => {
    toEdit.value = isEdited(episodeId) ? -1 : episodeId;
}

const addViewing = async (episode: UserEpisode): Promise<void> => {
    await addEpisodeViewing(props.userSeasonId, episode.episodeId);
    await load();
    emit("refresh");
}

const selectViewing = (episode: UserEpisode): void => {
    selected.value = episode;
    modal.value = true;
}

const removeViewing = async (): Promise<void> => {
    if (!selected.value?.id) return;
    await deleteEpisodeViewing(selected.value.id);
    modal.value = false;
    await load();
    emit("refresh");
}

const saveViewedAt = async (episode: UserEpisode): Promise<void> => {
    if (!episode.id || !watchedAtInput.value) return;
    await updateEpisodeViewing(episode.id, fromDatetimeLocalInput(watchedAtInput.value));
    toEdit.value = -1;
    await load();
}

watch(toEdit, () => {
    const episode = episodes.value.find((e) => e.episodeId === toEdit.value);
    watchedAtInput.value = episode?.watchedAt ? toDatetimeLocalInput(episode.watchedAt) : "";
});

onBeforeMount(load);
</script>

<style scoped>
.v-expansion-panels {
    margin-top: 16px;
}

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

.episode-entry-description {
    margin: 6px 0 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: rgb(var(--v-theme-on-surface-variant));
}

.episode-entry-btn {
    flex-shrink: 0;
}

.episode-entry-edit {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgb(var(--v-border-color));
}
</style>
