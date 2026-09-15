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
                <v-list-item :prepend-icon="DATABASE_ICON" title="Exporter mes données" @click="settings.exportData" />
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

    <v-dialog v-model="deleteAccountDialog" max-width="420" persistent>
        <v-card title="Supprimer mon compte">
            <v-card-text>
                <p class="mb-4">
                    Votre compte sera désactivé immédiatement. Vous avez 30 jours pour vous reconnecter et annuler
                    la suppression - passé ce délai, votre nom d'utilisateur, votre email et votre photo seront
                    définitivement anonymisés.
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
import { DATABASE_ICON, DELETE_ICON } from '@/constants/icons';
import storageService from '@/services/storageService';
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK, applyThemeClass } from '@/utils/theme';
import { useTheme } from 'vuetify';
import { computed, onBeforeMount, ref } from 'vue';

const settings = useSettings();
const { getProfile, updateEpisodeTracking, requestDeletion } = useUser();
const { logout } = useAuth();
const { showInfo } = useSnackbar();
const theme = useTheme();

const deleteAccountDialog = ref(false);
const deleteAccountValid = ref(false);
const deleteAccountPassword = ref("");
const deleteAccountError = ref("");
const deleteAccountLoading = ref(false);

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
        deleteAccountDialog.value = false;
        showInfo("Compte programmé pour suppression. Reconnectez-vous dans les 30 jours pour l'annuler.");
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