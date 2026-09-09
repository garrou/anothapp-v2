<template>
    <base-app-bar />

    <v-container>
        <div class="d-flex justify-end mb-4">
            <v-btn color="primary" rounded="pill" :prepend-icon="ADD_ICON" @click="creating = true">
                Nouvelle playlist
            </v-btn>
        </div>

        <card-grid v-if="playlists.length" :items="playlists" :loading="loading" :sm="6" :md="4" :lg="3">
            <template #default="{ item: playlist }">
                <v-card class="playlist-card" :to="`/playlists/${playlist.id}`">
                    <v-card-title>{{ playlist.name }}</v-card-title>
                    <v-card-subtitle class="d-flex align-center ga-1 pb-4">
                        {{ buildPlural("série", playlist.showsCount ?? 0) }}
                        <v-icon v-if="!playlist.visible" icon="mdi-lock-outline" size="14" />
                    </v-card-subtitle>
                </v-card>
            </template>
        </card-grid>
        <empty-state v-else-if="!loading" icon="mdi-playlist-play" title="Aucune playlist"
            description="Créez une playlist pour regrouper des séries à partager avec vos amis." />

        <playlist-form-modal v-model="creating" @cancel="creating = false" @save="onCreate" />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PlaylistFormModal from "@/components/playlists/PlaylistFormModal.vue";
import { ADD_ICON } from "@/constants/icons";
import { usePlaylist } from "@/composables/playlist";
import { useSnackbar } from "@/composables/snackbar";
import type { Playlist } from "@/models/playlist";
import { buildPlural } from "@/utils/format";
import { onBeforeMount, ref } from "vue";

const { getPlaylists, createPlaylist } = usePlaylist();
const { showError } = useSnackbar();

const playlists = ref<Playlist[]>([]);
const loading = ref(false);
const creating = ref(false);

const fetchPlaylists = async (): Promise<void> => {
    loading.value = true;
    try {
        playlists.value = await getPlaylists();
    } finally {
        loading.value = false;
    }
}

const onCreate = async (name: string, visible: boolean): Promise<void> => {
    try {
        const playlist = await createPlaylist(name, visible);
        playlists.value = [playlist, ...playlists.value];
        creating.value = false;
    } catch (e) {
        showError(e as Error);
    }
}

onBeforeMount(fetchPlaylists);
</script>

<style scoped>
.playlist-card {
    height: 100%;
}
</style>
