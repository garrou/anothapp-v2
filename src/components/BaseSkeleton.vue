<template>
    <v-skeleton-loader :elevation="ELEVATION" :loading="loading" :type="type">
        <v-responsive>
            <slot name="content" />
        </v-responsive>
    </v-skeleton-loader>
</template>

<script lang="ts" setup>
import { ELEVATION } from '@/constants/style';
import type { PropType } from 'vue';

defineProps({
    loading: { type: Boolean, required: true },
    type: { type: String as PropType<"card" | "table">, required: true }
});
</script>