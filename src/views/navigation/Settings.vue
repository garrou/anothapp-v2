<template>
    <base-app-bar />

    <v-container>
        <v-card>
            <v-list>
                <v-list-item prepend-icon="mdi-refresh" title="Réinitialiser l'application" @click="settings.clearCaches" />
                <v-list-item prepend-icon="mdi-database" title="Exporter mes données" @click="settings.exportData" />
            </v-list>
        </v-card>
    </v-container>
</template>

<script lang="ts" setup>
import BaseAppBar from '@/components/BaseAppBar.vue';
import { useSettings } from '@/composables/settings';

const settings = useSettings();
</script>