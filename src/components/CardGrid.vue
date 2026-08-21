<template>
    <v-container v-if="items.length || loading" fluid class="pa-0">
        <v-row dense>
            <v-col v-for="(item, index) in items" :key="index" :cols="cols" :md="md" :lg="lg">
                <base-skeleton :loading="loading" type="card">
                    <slot :item="item" />
                </base-skeleton>
            </v-col>
        </v-row>
    </v-container>
    <slot v-else name="empty" />
</template>

<script setup lang="ts" generic="T">
import BaseSkeleton from "./BaseSkeleton.vue";

withDefaults(defineProps<{
    items: T[];
    loading: boolean;
    cols?: number | string;
    md?: number | string;
    lg?: number | string;
}>(), {
    cols: 6,
    md: 4,
    lg: 3,
});
</script>
