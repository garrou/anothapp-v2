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
                <v-list-item prepend-icon="mdi-database" title="Exporter mes données" @click="settings.exportData" />
                <v-list-item class="text-error" prepend-icon="mdi-refresh" title="Réinitialiser l'application"
                    @click="confirmReset = true" />
            </v-list>
        </v-card>
    </v-container>

    <base-confirm v-model="confirmReset" title="Réinitialiser l'application"
        text="Les données mises en cache seront supprimées et l'application va recharger. Confirmez-vous ?"
        confirm-text="Réinitialiser" persistent @cancel="confirmReset = false" @confirm="settings.clearCaches" />
</template>

<script lang="ts" setup>
import BaseAppBar from '@/components/BaseAppBar.vue';
import BaseConfirm from '@/components/BaseConfirm.vue';
import { useSettings } from '@/composables/settings';
import storageService from '@/services/storageService';
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK, applyThemeClass } from '@/utils/theme';
import { useTheme } from 'vuetify';
import { ref } from 'vue';

const settings = useSettings();
const theme = useTheme();

const isDark = ref(theme.global.name.value === THEME_ANOTHAPP_DARK);
const confirmReset = ref(false);

const toggleTheme = (value: boolean | null) => {
    const name = value ? THEME_ANOTHAPP_DARK : THEME_ANOTHAPP;
    theme.global.name.value = name;
    applyThemeClass(name);
    storageService.storeTheme(name);
}
</script>