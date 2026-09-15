<template>
    <base-app-bar />

    <v-container>
        <v-list v-if="pendingInvitations.length" class="pending-invitations mb-4" density="compact" rounded="lg">
            <v-list-item v-for="invitation in pendingInvitations" :key="invitation.playlistId"
                :title="invitation.playlistName" :subtitle="`Invitation de ${invitation.ownerUsername}`">
                <template #prepend>
                    <v-avatar v-if="invitation.ownerPicture" :image="invitation.ownerPicture" size="32" />
                    <v-avatar v-else color="surface-variant" size="32">
                        <v-icon :icon="ACCOUNT_ICON" size="18" />
                    </v-avatar>
                </template>
                <template #append>
                    <div class="d-flex ga-2">
                        <v-btn color="primary" size="small" variant="flat" @click="acceptInvitation(invitation)">
                            Accepter
                        </v-btn>
                        <v-btn size="small" variant="outlined" @click="declineInvitation(invitation)">Refuser</v-btn>
                    </div>
                </template>
            </v-list-item>
        </v-list>

        <div class="d-flex justify-end mb-4">
            <v-btn color="primary" rounded="pill" :prepend-icon="ADD_ICON" @click="creating = true">
                Nouvelle playlist
            </v-btn>
        </div>

        <card-grid v-if="playlists.length" :items="playlists" :loading="loading" :sm="6" :md="4" :lg="3">
            <template #default="{ item: playlist }">
                <v-card class="playlist-card" :to="`/playlists/${playlist.id}`">
                    <playlist-cover :posters="playlist.posters ?? []" />
                    <v-card-title>{{ playlist.name }}</v-card-title>
                    <v-card-subtitle class="d-flex align-center ga-1 pb-4">
                        {{ buildPlural("série", playlist.showsCount ?? 0) }}
                        <v-icon v-if="!playlist.visible" :icon="LOCK_ICON" size="14" />
                        <v-icon v-if="playlist.role === 'collaborator'" :icon="ACCOUNT_MULTIPLE_ICON" size="14"
                            title="Playlist collaborative" />
                    </v-card-subtitle>
                </v-card>
            </template>
        </card-grid>
        <empty-state v-else-if="!loading" :icon="PLAYLIST_PLAY_ICON" title="Aucune playlist"
            description="Créez une playlist pour regrouper des séries à partager avec vos amis." />

        <playlist-form-modal v-model="creating" @cancel="creating = false" @save="onCreate" />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PlaylistCover from "@/components/playlists/PlaylistCover.vue";
import PlaylistFormModal from "@/components/playlists/PlaylistFormModal.vue";
import { ACCOUNT_ICON, ACCOUNT_MULTIPLE_ICON, ADD_ICON, LOCK_ICON, PLAYLIST_PLAY_ICON } from "@/constants/icons";
import { usePlaylist } from "@/composables/playlist";
import { useUser } from "@/composables/user";
import { useSnackbar } from "@/composables/snackbar";
import type { Playlist, PlaylistInvitation } from "@/models/playlist";
import { buildPlural } from "@/utils/format";
import { onBeforeMount, ref } from "vue";

const { getPlaylists, getPendingInvitations, createPlaylist, acceptCollaboratorInvite, removeCollaborator } = usePlaylist();
const { getProfile } = useUser();
const { showError } = useSnackbar();

const playlists = ref<Playlist[]>([]);
const pendingInvitations = ref<PlaylistInvitation[]>([]);
const currentUserId = ref<string>();
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

const fetchPendingInvitations = async (): Promise<void> => {
    pendingInvitations.value = await getPendingInvitations();
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

const acceptInvitation = async (invitation: PlaylistInvitation): Promise<void> => {
    try {
        await acceptCollaboratorInvite(invitation.playlistId);
        pendingInvitations.value = pendingInvitations.value.filter((i) => i.playlistId !== invitation.playlistId);
        await fetchPlaylists();
    } catch (e) {
        showError(e as Error);
    }
}

const declineInvitation = async (invitation: PlaylistInvitation): Promise<void> => {
    if (!currentUserId.value) return;

    try {
        await removeCollaborator(invitation.playlistId, currentUserId.value, "Invitation refusée");
        pendingInvitations.value = pendingInvitations.value.filter((i) => i.playlistId !== invitation.playlistId);
    } catch (e) {
        showError(e as Error);
    }
}

onBeforeMount(async () => {
    const profile = await getProfile();
    currentUserId.value = profile.id;
    await Promise.all([fetchPlaylists(), fetchPendingInvitations()]);
});
</script>

<style scoped>
.playlist-card {
    height: 100%;
}
</style>
