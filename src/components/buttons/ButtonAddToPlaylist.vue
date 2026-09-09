<template>
    <v-list-item v-if="menuItem" :prepend-icon="PLAYLIST_ADD_ICON" title="Ajouter à une playlist" @click="open" />

    <v-tooltip v-else text="Ajouter à une playlist" :location="tooltipLocation">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="on-surface-variant" :icon="PLAYLIST_ADD_ICON" variant="text"
                @click="open" />
        </template>
    </v-tooltip>

    <base-modal v-model="dialog" title="Ajouter à une playlist">
        <v-list v-if="playlists.length">
            <v-list-item v-for="playlist in playlists" :key="playlist.id" :title="playlist.name"
                :disabled="addedPlaylistIds.has(playlist.id)" @click="add(playlist.id)">
                <template #append>
                    <v-icon v-if="addedPlaylistIds.has(playlist.id)" icon="mdi-check" color="primary" />
                </template>
            </v-list-item>
        </v-list>
        <div v-else-if="!loading" class="text-center text-medium-emphasis py-4">
            Vous n'avez pas encore de playlist.
            <router-link to="/playlists">Créez-en une</router-link>
        </div>
    </base-modal>
</template>

<script lang="ts" setup>
import { ref, type PropType } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { TOOLTIP_LOCATION } from "@/constants/style";
import { usePlaylist } from "@/composables/playlist";
import { useSnackbar } from "@/composables/snackbar";
import type { Playlist } from "@/models/playlist";
import { PLAYLIST_ADD_ICON } from "@/constants/icons";

const props = defineProps({
    menuItem: { type: Boolean, default: false },
    serieId: { type: Number, required: true },
    tooltipLocation: { type: String as PropType<"left" | "bottom">, default: TOOLTIP_LOCATION }
});

const { getPlaylists, addShowToPlaylist } = usePlaylist();
const { showError } = useSnackbar();

const dialog = ref(false);
const playlists = ref<Playlist[]>([]);
const addedPlaylistIds = ref<Set<number>>(new Set());
const loading = ref(false);

const open = async (): Promise<void> => {
    dialog.value = true;
    addedPlaylistIds.value = new Set();

    if (playlists.value.length) return;
    loading.value = true;
    try {
        playlists.value = await getPlaylists();
    } catch (e) {
        showError(e as Error);
    } finally {
        loading.value = false;
    }
}

const add = async (playlistId: number): Promise<void> => {
    try {
        await addShowToPlaylist(playlistId, props.serieId);
        addedPlaylistIds.value = new Set([...addedPlaylistIds.value, playlistId]);
    } catch (e) {
        showError(e as Error);
    }
}
</script>
