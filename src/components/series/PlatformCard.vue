import { PLATFORM_ICON } from '@/constants/icons';

<template>
    <template v-if="platform">
        <v-avatar v-if="platform.logo" :image="platform.logo" />
        <v-avatar v-else color="grey">
            <v-icon color="white" :icon="PLATFORM_ICON" />
        </v-avatar>
        <span v-if="showName" class="ms-2">{{ platform.name }}</span>
    </template>
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