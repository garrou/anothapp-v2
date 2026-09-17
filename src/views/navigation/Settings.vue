<template>
    <base-app-bar />

    <v-container>
        <v-card>
            <v-list>
                <v-list-item prepend-icon="mdi-weather-night" title="Thème sombre">
                    <template #append>
                        <v-switch v-model="isDark" color="primary" hide-details @update:model-value="toggleTheme" />
                    </template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-format-list-checks" title="Suivi des épisodes"
                    :subtitle="episodeTrackingSubtitle">
                    <template #append>
                        <v-switch v-model="episodeTrackingEnabled" color="primary" hide-details
                            :loading="episodeTrackingLoading" :disabled="episodeTrackingLoading"
                            @update:model-value="toggleEpisodeTracking" />
                    </template>
                </v-list-item>
                <v-list-item :prepend-icon="DATABASE_EXPORT_ICON" title="Exporter mes données" @click="openExportConfirm" />
                <v-list-item :prepend-icon="DATABASE_IMPORT_ICON" title="Importer mes données"
                    @click="openImportDialog" />
                <v-list-item :prepend-icon="DELETE_ICON" title="Supprimer mon compte" base-color="error"
                    @click="openDeleteAccount" />
            </v-list>
        </v-card>
    </v-container>

    <base-confirm v-model="confirmEpisodeTracking" title="Activer le suivi des épisodes"
        text="Votre historique existant sera synchronisé au niveau des épisodes, ce qui peut prendre un moment selon le nombre de séries suivies. Confirmez-vous ?"
        confirm-text="Activer" confirm-color="primary" persistent @cancel="cancelEpisodeTracking"
        @confirm="confirmEpisodeTrackingEnable" />

    <base-confirm v-model="confirmEpisodeTrackingDisable" title="Désactiver le suivi des épisodes"
        text="Rien ne sera supprimé : vos épisodes déjà enregistrés restent disponibles et vous pourrez réactiver le suivi à tout moment. Confirmez-vous ?"
        confirm-text="Désactiver" persistent @cancel="cancelEpisodeTrackingDisable"
        @confirm="confirmEpisodeTrackingDisableConfirm" />

    <base-confirm v-model="confirmExportDialog" title="Exporter mes données"
        text="Un fichier JSON contenant vos séries, saisons, épisodes, playlists, acteurs favoris et plateformes sera téléchargé. Confirmez-vous ?"
        confirm-text="Exporter" confirm-color="primary" @cancel="confirmExportDialog = false"
        @confirm="confirmExport" />

    <v-dialog v-model="importDialog" max-width="420" persistent>
        <v-card title="Importer mes données">
            <v-card-text>
                <p class="mb-4">
                    Sélectionnez un fichier JSON précédemment exporté depuis Anothapp. Vos amis et les
                    playlists partagées par d'autres ne sont pas réimportés : vous devrez les rétablir
                    vous-même. Votre compte actuel (nom d'utilisateur, email, mot de passe) n'est jamais
                    modifié par l'import.
                </p>
                <v-file-input v-model="importFile" label="Fichier JSON" accept="application/json"
                    :error-messages="importError" :disabled="importLoading" />
                <v-alert v-if="importPreview" type="info" variant="tonal" density="compact">
                    {{ importPreview.shows }} série(s), {{ importPreview.seasons }} saison(s),
                    {{ importPreview.episodes }} épisode(s), {{ importPreview.playlists }} playlist(s),
                    {{ importPreview.favoriteActors }} acteur(s) favori(s) et {{ importPreview.platforms }}
                    plateforme(s) seront importés.
                </v-alert>
            </v-card-text>
            <template #actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" :disabled="importLoading" @click="closeImportDialog">
                    Annuler
                </v-btn>
                <v-btn color="primary" variant="flat" :disabled="!importPreview" :loading="importLoading"
                    @click="confirmImport">
                    Importer
                </v-btn>
            </template>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteAccountDialog" max-width="420" persistent>
        <v-card title="Supprimer mon compte">
            <v-card-text>
                <p class="mb-4">
                    Votre compte sera désactivé immédiatement. Vous avez 15 jours (deux semaines) pour vous
                    reconnecter et annuler la suppression - passé ce délai, votre nom d'utilisateur, votre email
                    et votre photo seront définitivement anonymisés.
                </p>
                <v-form v-model="deleteAccountValid" @submit="confirmDeleteAccount" @submit.prevent>
                    <v-text-field v-model="deleteAccountPassword" label="Mot de passe" required type="password"
                        :error-messages="deleteAccountError" />
                </v-form>
            </v-card-text>
            <template #actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" :disabled="deleteAccountLoading" @click="closeDeleteAccount">
                    Annuler
                </v-btn>
                <v-btn color="error" variant="flat" :disabled="!deleteAccountValid" :loading="deleteAccountLoading"
                    @click="confirmDeleteAccount">
                    Supprimer
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import BaseAppBar from '@/components/BaseAppBar.vue';
import BaseConfirm from '@/components/BaseConfirm.vue';
import { useAuth } from '@/composables/auth';
import { useSettings } from '@/composables/settings';
import { useSnackbar } from '@/composables/snackbar';
import { useUser } from '@/composables/user';
import { DATABASE_EXPORT_ICON, DATABASE_IMPORT_ICON, DELETE_ICON } from '@/constants/icons';
import storageService from '@/services/storageService';
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK, applyThemeClass } from '@/utils/theme';
import { useTheme } from 'vuetify';
import type { ImportPayload, ImportPreview } from '@/models/importPayload';
import { computed, onBeforeMount, ref, watch } from 'vue';

const settings = useSettings();
const { getProfile, updateEpisodeTracking, requestDeletion } = useUser();
const { logout } = useAuth();
const { showInfo, showSuccess } = useSnackbar();
const theme = useTheme();

const deleteAccountDialog = ref(false);
const deleteAccountValid = ref(false);
const deleteAccountPassword = ref("");
const deleteAccountError = ref("");
const deleteAccountLoading = ref(false);

const confirmExportDialog = ref(false);
const importDialog = ref(false);
const importFile = ref<File>();
const importPayload = ref<ImportPayload>();
const importPreview = ref<ImportPreview>();
const importError = ref("");
const importLoading = ref(false);

let importFileRequestId = 0;

watch(importFile, async (file) => {
    const requestId = ++importFileRequestId;
    importPayload.value = undefined;
    importPreview.value = undefined;
    importError.value = "";

    if (!file) {
        return;
    }
    try {
        const payload = await settings.readImportFile(file);
        // A quicker second file selection can resolve before this one - ignore a stale result
        // so the preview (and what "Importer" would send) always matches the visible selection.
        if (requestId !== importFileRequestId) {
            return;
        }
        importPayload.value = payload;
        importPreview.value = settings.previewImportPayload(payload);
    } catch (e) {
        if (requestId !== importFileRequestId) {
            return;
        }
        importError.value = (e as Error).message;
    }
});

const isDark = ref(theme.global.name.value === THEME_ANOTHAPP_DARK);
const confirmEpisodeTracking = ref(false);
const confirmEpisodeTrackingDisable = ref(false);
const episodeTrackingEnabled = ref(false);
const episodeTrackingLoading = ref(false);

const episodeTrackingSubtitle = computed(() =>
    episodeTrackingLoading.value && episodeTrackingEnabled.value
        ? "Synchronisation de l'historique en cours…"
        : undefined
);

const toggleTheme = (value: boolean | null) => {
    const name = value ? THEME_ANOTHAPP_DARK : THEME_ANOTHAPP;
    theme.global.name.value = name;
    applyThemeClass(name);
    storageService.storeTheme(name);
}

const applyEpisodeTracking = async (value: boolean) => {
    episodeTrackingLoading.value = true;

    try {
        await updateEpisodeTracking(value);
    } catch (e) {
        episodeTrackingEnabled.value = !value;
        throw e;
    } finally {
        episodeTrackingLoading.value = false;
    }
}

const toggleEpisodeTracking = async (value: boolean | null) => {
    if (value) {
        confirmEpisodeTracking.value = true;
        return;
    }
    confirmEpisodeTrackingDisable.value = true;
}

const cancelEpisodeTracking = () => {
    episodeTrackingEnabled.value = false;
    confirmEpisodeTracking.value = false;
}

const confirmEpisodeTrackingEnable = async () => {
    confirmEpisodeTracking.value = false;
    await applyEpisodeTracking(true);
}

const cancelEpisodeTrackingDisable = () => {
    episodeTrackingEnabled.value = true;
    confirmEpisodeTrackingDisable.value = false;
}

const confirmEpisodeTrackingDisableConfirm = async () => {
    confirmEpisodeTrackingDisable.value = false;
    await applyEpisodeTracking(false);
}

const openExportConfirm = () => {
    confirmExportDialog.value = true;
}

const confirmExport = () => {
    confirmExportDialog.value = false;
    settings.exportData();
}

const openImportDialog = () => {
    importFile.value = undefined;
    importPayload.value = undefined;
    importPreview.value = undefined;
    importError.value = "";
    importDialog.value = true;
}

const closeImportDialog = () => {
    importDialog.value = false;
}

const confirmImport = async () => {
    if (!importPayload.value) {
        return;
    }
    importLoading.value = true;
    importError.value = "";

    try {
        const summary = await settings.importData(importPayload.value);
        importDialog.value = false;
        const total = summary.shows.imported + summary.playlists.imported
            + summary.favoriteActors.imported + summary.platforms.imported;
        showSuccess(`Import terminé : ${total} élément(s) importé(s).`);
    } catch (e) {
        importError.value = (e as Error).message;
    } finally {
        importLoading.value = false;
    }
}

const openDeleteAccount = () => {
    deleteAccountPassword.value = "";
    deleteAccountError.value = "";
    deleteAccountDialog.value = true;
}

const closeDeleteAccount = () => {
    deleteAccountDialog.value = false;
}

const confirmDeleteAccount = async () => {
    deleteAccountLoading.value = true;
    deleteAccountError.value = "";

    try {
        await requestDeletion(deleteAccountPassword.value);
        deleteAccountPassword.value = "";
        deleteAccountDialog.value = false;
        showInfo("Compte programmé pour suppression. Reconnectez-vous dans les 15 jours pour l'annuler.");
        await logout();
    } catch (e) {
        deleteAccountError.value = (e as Error).message;
    } finally {
        deleteAccountLoading.value = false;
    }
}

onBeforeMount(async () => {
    const user = await getProfile();
    episodeTrackingEnabled.value = user.episodeTrackingEnabled ?? false;
});
</script>