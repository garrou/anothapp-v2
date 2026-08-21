<template>
    <base-app-bar />

    <v-container>
        <v-card>
            <v-list>
                <v-list-item title="Thème sombre">
                    <template #append>
                        <v-switch v-model="isDark" color="primary" hide-details @update:model-value="toggleTheme" />
                    </template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-refresh" title="Réinitialiser l'application" @click="settings.clearCaches" />
                <v-list-item prepend-icon="mdi-database" title="Exporter mes données" @click="settings.exportData" />
            </v-list>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from '@/components/BaseAppBar.vue';
import { useSettings } from '@/composables/settings';
import storageService from '@/services/storageService';
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK, applyThemeClass } from '@/utils/theme';
import { useTheme } from 'vuetify';
import { ref } from 'vue';

const settings = useSettings();
const theme = useTheme();

const isDark = ref(theme.global.name.value === THEME_ANOTHAPP_DARK);

const toggleTheme = (value: boolean | null) => {
    const name = value ? THEME_ANOTHAPP_DARK : THEME_ANOTHAPP;
    theme.global.name.value = name;
    applyThemeClass(name);
    storageService.storeTheme(name);
}
</script>