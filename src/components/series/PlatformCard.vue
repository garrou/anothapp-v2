<template>
    <span v-if="platform" class="platform-card">
        <v-avatar v-if="platform.logo" :image="platform.logo" />
        <v-avatar v-else color="grey">
            <v-icon color="white" :icon="PLATFORM_ICON" />
        </v-avatar>
        <span v-if="showName" class="ms-2">{{ platform.name }}</span>
    </span>
</template>

<script lang="ts" setup>
import { PLATFORM_ICON } from '@/constants/icons';
import type { Platform } from '@/models/serie';
import type { PropType } from 'vue';

const props = defineProps({
    platform: { type: Object as PropType<Platform> },
    showName: { type: Boolean, default: false }
});
</script>

<style scoped>
.platform-card {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
}
</style>