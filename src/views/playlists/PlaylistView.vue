<template>
    <base-app-bar />

    <v-container v-if="detail">
        <div class="d-flex align-center justify-space-between mb-2">
            <div>
                <h1 class="playlist-title">{{ detail.playlist.name }}</h1>
                <div class="text-caption text-medium-emphasis d-flex align-center ga-1">
                    {{ buildPlural("série", detail.shows.length) }}
                    <template v-if="!detail.playlist.visible">
                        <v-icon icon="mdi-lock-outline" size="14" />
                        Privée
                    </template>
                </div>
            </div>

            <base-menu v-if="isOwner" open-on-click>
                <v-list-item title="Modifier" :prepend-icon="EDIT_ICON" @click="editing = true" />
                <v-list-item title="Supprimer" :prepend-icon="DELETE_ICON" @click="deleting = true" />
            </base-menu>
        </div>

        <div v-if="isOwner" class="mb-4">
            <v-text-field v-model="query" clearable density="compact" hide-details :prepend-inner-icon="SEARCH_ICON"
                placeholder="Ajouter une série..." @keyup.enter="search" @click:clear="results = []" />
            <v-list v-if="results.length" class="search-results" density="compact">
                <v-list-item v-for="serie in results" :key="serie.id" :title="serie.title" @click="addShow(serie.id)">
                    <template #prepend>
                        <v-avatar rounded size="32">
                            <v-img v-if="serie.poster" :src="serie.poster" />
                        </v-avatar>
                    </template>
                </v-list-item>
            </v-list>
        </div>

        <card-grid v-if="detail.shows.length" :items="detail.shows" :loading="false" :sm="6" :md="4" :lg="3">
            <template #default="{ item: serie }">
                <poster-card :image="serie.poster" :to="`/discover/${serie.id}`">
                    <template v-if="isOwner" #quick-actions>
                        <v-btn :icon="DELETE_ICON" color="on-surface-variant" size="32" variant="flat"
                            @click.stop.prevent="removeShow(serie.id)" />
                    </template>

                    <v-card-subtitle class="pt-4 pb-4 text-wrap font-weight-medium">
                        <router-link class="playlist-show-title" :text="serie.title" :to="`/discover/${serie.id}`" />
                    </v-card-subtitle>
                </poster-card>
            </template>
        </card-grid>
        <empty-state v-else icon="mdi-movie-open-outline" title="Playlist vide"
            :description="isOwner ? 'Recherchez une série ci-dessus pour l\'ajouter.' : 'Cette playlist ne contient aucune série pour le moment.'" />

        <playlist-form-modal v-model="editing" :playlist="detail.playlist" confirm-text="Enregistrer"
            title="Modifier la playlist" @cancel="editing = false" @save="onUpdate" />

        <base-confirm v-model="deleting" title="Supprimer" text="Supprimer cette playlist ?" persistent
            @cancel="deleting = false" @confirm="onDelete" />
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from "@/components/BaseAppBar.vue";
import BaseConfirm from "@/components/BaseConfirm.vue";
import BaseMenu from "@/components/BaseMenu.vue";
import CardGrid from "@/components/CardGrid.vue";
import EmptyState from "@/components/EmptyState.vue";
import PosterCard from "@/components/PosterCard.vue";
import PlaylistFormModal from "@/components/playlists/PlaylistFormModal.vue";
import { DELETE_ICON, EDIT_ICON, SEARCH_ICON } from "@/constants/icons";
import { usePlaylist } from "@/composables/playlist";
import { useUser } from "@/composables/user";
import { useSnackbar } from "@/composables/snackbar";
import searchService from "@/services/searchService";
import { isError } from "@/utils/response";
import type { PlaylistDetail } from "@/models/playlist";
import type { Serie } from "@/models/serie";
import { buildPlural } from "@/utils/format";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    id: { type: Number, required: true },
});

const router = useRouter();
const { getPlaylist, updatePlaylist, deletePlaylist, addShowToPlaylist, removeShowFromPlaylist } = usePlaylist();
const { getProfile } = useUser();
const { showError } = useSnackbar();

const detail = ref<PlaylistDetail>();
const currentUserId = ref<string>();
const query = ref("");
const results = ref<Serie[]>([]);
const editing = ref(false);
const deleting = ref(false);

const isOwner = computed(() => detail.value?.playlist.userId === currentUserId.value);

const search = async (): Promise<void> => {
    if (!query.value.trim()) {
        results.value = [];
        return;
    }
    const resp = await searchService.getSeries(query.value.trim());
    const data = await resp.json();

    if (!isError(resp.status)) {
        results.value = data;
    }
}

const addShow = async (showId: number): Promise<void> => {
    try {
        await addShowToPlaylist(props.id, showId);
        query.value = "";
        results.value = [];
        detail.value = await getPlaylist(props.id);
    } catch (e) {
        showError(e as Error);
    }
}

const removeShow = async (showId: number): Promise<void> => {
    try {
        await removeShowFromPlaylist(props.id, showId);
        if (detail.value) {
            detail.value.shows = detail.value.shows.filter((serie) => serie.id !== showId);
        }
    } catch (e) {
        showError(e as Error);
    }
}

const onUpdate = async (name: string, visible: boolean): Promise<void> => {
    try {
        await updatePlaylist(props.id, { name, visible });
        if (detail.value) {
            detail.value.playlist.name = name;
            detail.value.playlist.visible = visible;
        }
        editing.value = false;
    } catch (e) {
        showError(e as Error);
    }
}

const onDelete = async (): Promise<void> => {
    try {
        await deletePlaylist(props.id, detail.value?.playlist.name ?? "");
        router.replace("/playlists");
    } catch (e) {
        showError(e as Error);
    } finally {
        deleting.value = false;
    }
}

onBeforeMount(async () => {
    try {
        const [playlistDetail, profile] = await Promise.all([getPlaylist(props.id), getProfile()]);
        detail.value = playlistDetail;
        currentUserId.value = profile.id;
    } catch (e) {
        showError(e as Error);
        router.replace("/playlists");
    }
});
</script>

<style scoped>
.playlist-show-title {
    color: inherit;
}

.playlist-title {
    font-family: "Space Grotesk", sans-serif;
    font-size: 20px;
    font-weight: 700;
}

.search-results {
    border: 1px solid rgb(var(--v-border-color));
    border-radius: 8px;
    margin-top: 4px;
}
</style>
