<template>
    <v-card>
        <v-list>
            <v-list-item :prepend-icon="DELETE_ICON" title="Vider le cache" @click="clearCaches()" />
        </v-list>
    </v-card>
</template>

<script lang="ts" setup>
import cache from '@/cache';
import { useSnackbar } from '@/composables/snackbar';
import { DELETE_ICON } from '@/constants/icons';

const { showSuccess } = useSnackbar();

const clearCaches = async (): Promise<void> => {
    await cache.reset();
    showSuccess("Cache supprimé avec succès");
    location.reload();
}
</script>